document.addEventListener('DOMContentLoaded', () => {
    const cepInput = document.getElementById('cep');
    const enderecoInput = document.getElementById('endereco');
    const bairroInput = document.getElementById('bairro');
    const municipioInput = document.getElementById('municipio');
    const estadoInput = document.getElementById('estado');

    cepInput.addEventListener('blur', async () => { 
        const cep = cepInput.value.replace(/\D/g, ''); 
        if (cep.length === 8) { 
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();

                if (data.erro) {
                    alert('CEP não encontrado.');
                } else {
                    enderecoInput.value = data.logradouro || '';
                    bairroInput.value = data.bairro || '';
                    municipioInput.value = data.localidade || '';
                    estadoInput.value = data.uf || '';
                }
            } catch (error) {
                alert('Erro ao buscar CEP. Tente novamente.');
            }
        } else {
            alert('CEP inválido.');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const formFornecedor = document.getElementById('form-fornecedor');
    const addProdutoBtn = document.getElementById('add-produto');
    const produtosSection = document.getElementById('produtos-section');
    const addAnexoBtn = document.getElementById('add-anexo');
    const anexosSection = document.getElementById('anexos-section');
    let produtoCount = 1;

    function atualizarExclusaoProduto() {
        document.querySelectorAll('.btn-remove-produto').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const produto = event.target.closest('.produto');
                if (produto) {
                    produtosSection.removeChild(produto);
                }
            });
        });
    }

    function atualizarExclusaoAnexo() {
        document.querySelectorAll('.btn-remove-anexo').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const anexoItem = event.target.closest('.anexo-item');
                if (anexoItem) {
                    anexosSection.removeChild(anexoItem);
                }
            });
        });
    }

    function atualizarVisualizacaoAnexo() {
        document.querySelectorAll('.btn-view-anexo').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const fileInput = event.target.closest('.anexo-item').querySelector('input[type="file"]');
                if (fileInput.files.length > 0) {
                    const file = fileInput.files[0];
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const fileContent = e.target.result;
                        const newWindow = window.open();
                        newWindow.document.write(`<pre>${fileContent}</pre>`);
                    };
                    reader.readAsText(file);
                } else {
                    alert('Nenhum arquivo selecionado');
                }
            });
        });
    }

    function calcularValorTotal(produto) {
        const valorUnitario = parseFloat(produto.querySelector('.produto-valor-unitario').value) || 0;
        const quantidade = parseFloat(produto.querySelector('.produto-qtde').value) || 0;
        const valorTotal = valorUnitario * quantidade;
        produto.querySelector('.produto-valor-total').value = valorTotal.toFixed(2);
    }

    function adicionarListenersProdutos() {
        document.querySelectorAll('.produto').forEach(produto => {
            produto.querySelector('.produto-qtde').addEventListener('input', () => calcularValorTotal(produto));
            produto.querySelector('.produto-valor-unitario').addEventListener('input', () => calcularValorTotal(produto));
        });
    }

    addProdutoBtn.addEventListener('click', () => {
        produtoCount++;
        const newProduto = document.createElement('div');
        newProduto.classList.add('produto');
        newProduto.id = `produto-${produtoCount}`;
        newProduto.innerHTML = `
            <div class="produto-identificacao">
                <h4>Produto - ${produtoCount}</h4>
                <button type="button" class="btn btn-danger btn-remove-produto" title="Remover">
                    <i class="fas fa-trash-alt"></i> <!-- Ícone de lixeira -->
                </button>
            </div>
            <div class="produto-dados">
                <div>
                    <input type="text" class="form-control produto-nome" placeholder="Descrição do Produto" required>
                </div>
                <div>
                    <select class="form-control produto-unidade-medida" required>
                        <option value="" disabled selected>UND. Medida</option>
                        <option value="kg">Kg</option>
                        <option value="un">Unidade</option>
                    </select>
                    <input type="number" class="form-control produto-qtde" placeholder="Quantidade em Estoque" required>
                    <input type="number" class="form-control produto-valor-unitario" placeholder="Valor Unitário" required>
                    <input type="text" class="form-control produto-valor-total" placeholder="Valor Total" readonly>
                </div>
            </div>
        `;
        produtosSection.appendChild(newProduto);

        atualizarExclusaoProduto();
        adicionarListenersProdutos(); 
    });

    addAnexoBtn.addEventListener('click', () => {
        const newAnexo = document.createElement('div');
        newAnexo.classList.add('anexo-item');
        newAnexo.innerHTML = `
            <input type="file" class="form-control-file">
            <button class="btn btn-view-anexo" title="Visualizar"><i class="fas fa-eye"></i></button>
            <button class="btn btn-remove-anexo" title="Remover"><i class="fas fa-trash-alt"></i></button> <!-- Ícone de lixeira -->
        `;
        anexosSection.appendChild(newAnexo);

        atualizarExclusaoAnexo();
        atualizarVisualizacaoAnexo();
    });

    formFornecedor.addEventListener('submit', (event) => {
        event.preventDefault();
        let fornecedorData = {
            razaoSocial: document.getElementById('razaoSocial').value,
            nomeFantasia: document.getElementById('nomeFantasia').value,
            cnpj: document.getElementById('cnpj').value,
            inscricaoEstadual: document.getElementById('inscricaoEstadual').value,
            inscricaoMunicipal: document.getElementById('inscricaoMunicipal').value,
            endereco: document.getElementById('endereco').value,
            numero: document.getElementById('numero').value,
            complemento: document.getElementById('complemento').value,
            bairro: document.getElementById('bairro').value,
            municipio: document.getElementById('municipio').value,
            estado: document.getElementById('estado').value,
            nomePessoaContato: document.getElementById('nomePessoaContato').value,
            telefone: document.getElementById('telefone').value,
            email: document.getElementById('email').value,
            produtos: Array.from(document.querySelectorAll('.produto')).map(produto => ({
                descricao: produto.querySelector('.produto-nome').value,
                unidadeMedida: produto.querySelector('.produto-unidade-medida').value,
                quantidade: produto.querySelector('.produto-qtde').value,
                valorUnitario: produto.querySelector('.produto-valor-unitario').value,
                valorTotal: produto.querySelector('.produto-valor-total').value
            })),
            anexos: Array.from(document.querySelectorAll('.anexo-item')).map(anexo => {
                const fileInput = anexo.querySelector('input[type="file"]');
                return fileInput.files.length > 0 ? fileInput.files[0].name : null;
            }).filter(name => name !== null)
        };

        const jsonData = JSON.stringify(fornecedorData, null, 2);
        console.log('Dados para envio:', jsonData);
    });

    atualizarExclusaoProduto();
    atualizarExclusaoAnexo();
    atualizarVisualizacaoAnexo();
    adicionarListenersProdutos();
});

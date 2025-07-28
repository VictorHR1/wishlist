const dadosIniciais = {
    "🛋️ Móveis": ["Sofá", "Mesa de jantar com cadeiras", "Cama de casal", "Guarda-roupa", "Rack para TV", "Criados-mudos"],
    "🍳 Cozinha": ["Geladeira", "Fogão", "Micro-ondas", "Liquidificador", "Panela de pressão", "Jogo de panelas", "Pratos", "Copos", "Talheres", "Potes"],
    "🧺 Lavanderia e Limpeza": ["Máquina de lavar roupa", "Ferro de passar", "Tábua de passar", "Aspirador de pó", "Baldes e bacias", "Vassoura e rodo", "Produtos de limpeza"],
    "🛌 Quarto": ["Roupas de cama", "Travesseiros", "Cobertores", "Cortina"],
    "🛁 Banheiro": ["Jogo de toalhas", "Chuveiro", "Tapetes de banheiro", "Lixeira", "Porta-escovas"],
    "🔌 Eletrodomésticos": ["Televisão", "Sanduicheira", "Cafeteira"],
    "🛠️ Ferramentas e Outros": ["Caixa de ferramentas básica", "Extensões e benjamins", "Kit de primeiros socorros"]
};

const checklistDiv = document.getElementById('checklist');
const categoriaSelect = document.getElementById('categoriaSelect');

// Função para renderizar o checklist
function renderizarChecklist() {
    checklistDiv.innerHTML = ''; // Limpa a lista atual
    
    Object.keys(dadosIniciais).forEach(categoria => {
        // Cria o container da categoria
        const categoriaDiv = document.createElement('div');
        categoriaDiv.classList.add('categoria');
        
        const h2 = document.createElement('h2');
        h2.textContent = categoria;
        categoriaDiv.appendChild(h2);
        
        // Adiciona os itens
        dadosIniciais[categoria].forEach(itemText => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('item');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${categoria}-${itemText}`;
            checkbox.dataset.categoria = categoria;
            checkbox.dataset.item = itemText;

            const label = document.createElement('label');
            label.htmlFor = `${categoria}-${itemText}`;
            label.textContent = itemText;
            
            checkbox.onchange = () => {
                label.classList.toggle('checked', checkbox.checked);
            };

            itemDiv.appendChild(checkbox);
            itemDiv.appendChild(label);
            categoriaDiv.appendChild(itemDiv);
        });

        checklistDiv.appendChild(categoriaDiv);
    });

    // Preenche o seletor de categorias para adicionar novos itens
    categoriaSelect.innerHTML = Object.keys(dadosIniciais).map(c => `<option value="${c}">${c}</option>`).join('') + '<option value="Nova Categoria">-- Nova Categoria --</option>';
}

// Função para adicionar um novo item
function adicionarItem() {
    const novoItemInput = document.getElementById('novoItemInput');
    let itemText = novoItemInput.value.trim();
    let categoria = categoriaSelect.value;

    if (!itemText) {
        alert("Por favor, digite o nome do item.");
        return;
    }
    
    if (categoria === "Nova Categoria") {
        let novaCategoria = prompt("Digite o nome da nova categoria (com emoji, se quiser):");
        if (!novaCategoria || novaCategoria.trim() === '') {
            return; // Usuário cancelou ou não digitou nada
        }
        categoria = novaCategoria.trim();
        if (!dadosIniciais[categoria]) {
            dadosIniciais[categoria] = [];
        }
    }

    if (dadosIniciais[categoria].includes(itemText)) {
        alert("Este item já existe na categoria selecionada.");
        return;
    }
    
    dadosIniciais[categoria].push(itemText);
    novoItemInput.value = '';
    renderizarChecklist(); // Re-renderiza a lista toda com o novo item
}

// Função para gerar e baixar a planilha CSV
function gerarPlanilha() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Categoria,Item,Status\n"; // Cabeçalho do CSV

    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        const categoria = checkbox.dataset.categoria;
        const item = checkbox.dataset.item;
        const status = checkbox.checked ? "Ok" : "Pendente";
        csvContent += `"${categoria}","${item}","${status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "checklist_mudanca.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Renderiza a lista inicial quando a página carrega
window.onload = renderizarChecklist;

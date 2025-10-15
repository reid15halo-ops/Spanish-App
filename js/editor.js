document.addEventListener('DOMContentLoaded', () => {

    const Editor = {
        ui: {
            tableBody: document.getElementById('item-table-body'),
            searchInput: document.getElementById('search-input'),
            tagFilter: document.getElementById('tag-filter'),
            typeFilter: document.getElementById('type-filter'),
            itemCount: document.getElementById('item-count'),
            undoBtn: document.getElementById('undo-btn'),
            redoBtn: document.getElementById('redo-btn'),
            importJsonBtn: document.getElementById('import-json-btn'),
            exportJsonBtn: document.getElementById('export-json-btn'),
            exportCsvBtn: document.getElementById('export-csv-btn'),
        },

        state: {
            items: [],
            filteredItems: [],
            allTags: new Set(),
            allTypes: new Set(),
            undoStack: [],
            redoStack: [],
        },

        async init() {
            this.autosave = this.debounce(this.autosave, 1000);
            await this.loadItems();
            this.renderTable();
            this.setupFilters();
            this.addEventListeners();
            console.log('Editor initialized.');
        },

        async loadItems() {
            const savedItems = localStorage.getItem('editor_items');
            if (savedItems) {
                this.state.items = JSON.parse(savedItems);
            } else {
                try {
                    const response = await fetch('data/items.json');
                    this.state.items = await response.json();
                } catch (error) { alert('Could not load item data.'); }
            }
            this.state.filteredItems = [...this.state.items];
            this.state.items.forEach(item => {
                item.tags.forEach(tag => this.state.allTags.add(tag));
                this.state.allTypes.add(item.type);
            });
        },

        setupFilters() {
            this.ui.tagFilter.innerHTML = '<option value="all">All Tags</option>';
            this.state.allTags.forEach(tag => this.ui.tagFilter.add(new Option(tag, tag)));
            this.ui.typeFilter.innerHTML = '<option value="all">All Types</option>';
            this.state.allTypes.forEach(type => this.ui.typeFilter.add(new Option(type, type)));
        },

        addEventListeners() {
            this.ui.searchInput.addEventListener('input', this.debounce(this.filterAndRender.bind(this), 300));
            this.ui.tagFilter.addEventListener('change', this.filterAndRender.bind(this));
            this.ui.typeFilter.addEventListener('change', this.filterAndRender.bind(this));
            this.ui.tableBody.addEventListener('blur', this.handleCellEdit.bind(this), true);
            this.ui.undoBtn.addEventListener('click', this.undo.bind(this));
            this.ui.redoBtn.addEventListener('click', this.redo.bind(this));
            this.ui.exportJsonBtn.addEventListener('click', this.exportAsJSON.bind(this));
            this.ui.exportCsvBtn.addEventListener('click', this.exportAsCSV.bind(this));
            this.ui.importJsonBtn.addEventListener('click', this.importFromJSON.bind(this));
        },

        handleCellEdit(event) {
            const cell = event.target;
            if (cell.tagName !== 'TD' || !cell.isContentEditable) return;
            const id = cell.parentElement.dataset.id;
            const field = cell.dataset.field;
            const newValue = cell.textContent;
            const item = this.state.items.find(i => i.id === id);
            const oldValue = Array.isArray(item[field]) ? item[field].join(', ') : item[field].toString();
            if (newValue !== oldValue) {
                this.state.undoStack.push({ id, field, oldValue, newValue });
                this.state.redoStack = [];
                this.updateItem(id, field, newValue);
                this.updateUndoRedoButtons();
                this.autosave();
            }
        },

        updateItem(id, field, value) {
            const item = this.state.items.find(i => i.id === id);
            if (!item) return;
            if (field === 'tags' || field === 'examples') {
                item[field] = value.split(/[,;]/).map(s => s.trim()).filter(Boolean);
            } else if (field === 'difficulty') {
                item[field] = parseInt(value, 10) || item[field];
            } else {
                item[field] = value;
            }
        },

        undo() {
            if (this.state.undoStack.length === 0) return;
            const action = this.state.undoStack.pop();
            this.state.redoStack.push(action);
            this.updateItem(action.id, action.field, action.oldValue);
            this.filterAndRender();
            this.updateUndoRedoButtons();
            this.autosave();
        },

        redo() {
            if (this.state.redoStack.length === 0) return;
            const action = this.state.redoStack.pop();
            this.state.undoStack.push(action);
            this.updateItem(action.id, action.field, action.newValue);
            this.filterAndRender();
            this.updateUndoRedoButtons();
            this.autosave();
        },

        updateUndoRedoButtons() {
            this.ui.undoBtn.disabled = this.state.undoStack.length === 0;
            this.ui.redoBtn.disabled = this.state.redoStack.length === 0;
        },

        autosave() { localStorage.setItem('editor_items', JSON.stringify(this.state.items)); },

        exportAsJSON() {
            this.triggerDownload(new Blob([JSON.stringify(this.state.items, null, 2)], { type: 'application/json' }), 'items.json');
        },

        exportAsCSV() {
            const headers = ['id', 'src', 'es', 'de', 'type', 'difficulty', 'tags', 'examples'];
            const rows = this.state.items.map(item => headers.map(h => `"${Array.isArray(item[h]) ? item[h].join('|') : item[h]}"`).join(','));
            this.triggerDownload(new Blob([[headers.join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' }), 'items.csv');
        },

        importFromJSON() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = e => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (!Array.isArray(imported)) throw new Error('JSON must be an array.');
                        const itemMap = new Map(this.state.items.map(i => [i.id, i]));
                        let updated = 0, added = 0;
                        imported.forEach(newItem => {
                            if (itemMap.has(newItem.id)) { Object.assign(itemMap.get(newItem.id), newItem); updated++; } 
                            else { itemMap.set(newItem.id, newItem); added++; }
                        });
                        this.state.items = Array.from(itemMap.values());
                        this.filterAndRender();
                        this.autosave();
                        alert(`Import complete: ${updated} updated, ${added} added.`);
                    } catch (err) { alert('Import failed.'); } 
                };
                reader.readAsText(e.target.files[0]);
            };
            input.click();
        },

        triggerDownload(blob, filename) {
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(a.href);
        },

        filterAndRender() {
            const searchTerm = this.ui.searchInput.value.toLowerCase();
            const selectedTag = this.ui.tagFilter.value;
            const selectedType = this.ui.typeFilter.value;
            this.state.filteredItems = this.state.items.filter(item => 
                (searchTerm === '' || item.es.toLowerCase().includes(searchTerm) || item.de.toLowerCase().includes(searchTerm)) &&
                (selectedTag === 'all' || item.tags.includes(selectedTag)) &&
                (selectedType === 'all' || item.type === selectedType)
            );
            this.renderTable();
        },

        renderTable() {
            this.ui.tableBody.innerHTML = '';
            this.ui.itemCount.textContent = `${this.state.filteredItems.length} / ${this.state.items.length} items`;
            this.state.filteredItems.forEach(item => {
                const row = this.ui.tableBody.insertRow();
                row.dataset.id = item.id;
                row.innerHTML = "
                    <td contenteditable=\"true\" data-field=\"es\">${item.es}</td>
                    <td contenteditable=\"true\" data-field=\"de\">${item.de}</td>
                    <td>${item.type}</td>
                    <td contenteditable=\"true\" data-field=\"tags\">${item.tags.join(', ')}</td>
                    <td contenteditable=\"true\" data-field=\"difficulty\">${item.difficulty}</td>
                    <td contenteditable=\"true\" data-field=\"examples\">${item.examples.join('; ')}</td>
                ";
            });
        },

        debounce(func, delay) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), delay);
            };
        },
    };

    Editor.init();
});

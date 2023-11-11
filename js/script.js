// Elementos
const notesContainer = document.querySelector("#notes-container");
const noteInput = document.querySelector("#note-content");
const addNoteBtn = document.querySelector(".add-note");
const searchInput = document.querySelector("#search-input");
const exportCsv = document.querySelector("#export-notes");

// funções
const createElementDocument = (elemento, classe) => {
    const element = document.createElement(elemento);
    element.classList.add(classe);
    return element;
};

function generateId() {
    return Math.floor(Math.random() * 100000000 + 100000000);
}

// Local storage
function getNotes() {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]");

    const orderedNotes = notes.sort((a, b) => (a.fixed > b.fixed ? -1 : 1));

    return orderedNotes;
}

function showNotes() {
    cleanNote();
    const notes = getNotes();

    notes.forEach((note) => {
        const element = createNote(note.id, note.content, note.fixed);
        notesContainer.appendChild(element);
    });
}

function cleanNote() {
    notesContainer.replaceChildren([]);
}

function deleteNote(id) {
    const notes = getNotes();

    const newNotes = notes.filter((note) => note.id !== id);

    saveNotes(newNotes);
    showNotes();
}

function updateNote(id, content) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.content = content;

    saveNotes(notes);
}

const duplicatedNote = (id) => {
    const notes = getNotes();

    const noteSelected = notes.filter((note) => note.id === id)[0];
    const newNote = {
        id: generateId(),
        content: noteSelected.content,
        fixed: noteSelected.fixed,
    };

    notes.push(newNote);

    saveNotes(notes);
    showNotes();
};

function createNote(id, content, fixed) {
    const div = createElementDocument("div", "note");

    const textarea = createElementDocument("textarea");
    textarea.innerText = content;
    textarea.placeholder = "Digite sua anotação... ";

    const fixedIcon = createElementDocument("i", "bi-pin");
    if (fixed) {
        div.classList.add("fixed");
    }
    const deleteIcon = createElementDocument("i", "bi-x-lg");
    const duplicatedIcon = createElementDocument("i", "bi-file-earmark-plus");

    div.appendChild(textarea);
    div.appendChild(fixedIcon);
    div.appendChild(deleteIcon);
    div.appendChild(duplicatedIcon);

    // Eventos do elemento
    div.querySelector("textarea").addEventListener("keyup", (e) => {
        const noteEditValue = e.target.value;

        updateNote(id, noteEditValue);
    });
    div.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id);
    });
    div.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id);
    });
    div.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        duplicatedNote(id);
    });

    return div;
}

function toggleFixNote(id) {
    const notes = getNotes();

    const targetNote = notes.filter((note) => note.id === id)[0];

    targetNote.fixed = !targetNote.fixed;

    saveNotes(notes);
    showNotes();
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function addNote() {
    const noteInputValue = noteInput.value.trim();

    const notes = getNotes();

    if (!noteInputValue) return;

    const objectNote = {
        id: generateId(),
        content: noteInputValue,
        fixed: false,
    };

    const element = createNote(
        objectNote.id,
        objectNote.content,
        objectNote.fixed
    );

    notesContainer.appendChild(element);

    notes.push(objectNote);

    saveNotes(notes);

    noteInput.value = "";
}

const searchNotes = (search) => {
    const notes = getNotes();

    const relatedSearch = notes.filter((note) =>
        note.content.toLowerCase().includes(search)
    );

    cleanNote();

    if (search !== "") {
        relatedSearch.forEach((note) => {
            const noteElement = createNote(note.id, note.content);
            notesContainer.appendChild(noteElement);
        });
        return;
    } else {
        showNotes();
    }
};

const exportData = () => {
    const notes = getNotes();

    const csvString = [
        ["ID", "Conteúdo", "Fixado?"],
        ...notes.map((note) => [note.id, note.content, note.fixed]),
    ]
        .map((e) => e.join(","))
        .join("\n");

    const element = document.createElement("a");

    element.href = "data:text/csv;charset:utf-8," + encodeURI(csvString);
    element.target = "_blank";
    element.download = "anotacoes.csv";
    element.click();
};

// eventos
addNoteBtn.addEventListener("click", () => addNote());
searchInput.addEventListener("keyup", (e) => {
    const searchValue = e.target.value;

    searchNotes(searchValue);
});
noteInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        addNote();
    }
});
exportCsv.addEventListener("click", () => {
    exportData();
});

// Inicialização
showNotes();

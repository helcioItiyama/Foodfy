const receitas = document.querySelectorAll(".seeRecipes")

const infos = document.querySelectorAll('.remove')
const icons = document.querySelectorAll('.icons')

for (let i = 0; i < icons.length; i++) {
    icons[i].addEventListener("click", () => {
       if (infos[i].classList.contains("hide")) {
           icons[i].innerHTML = "esconder";
           infos[i].classList.remove("hide")
       } else {
            icons[i].innerHTML = "mostrar"; 
            infos[i].classList.add("hide")
        }
    })
}


// Campos dinamicos
const buttonAddIngredient = document.querySelector("button.add-ingredient")
const buttonAddPreparation = document.querySelector("button.add-preparation")

if (buttonAddIngredient && buttonAddPreparation) {

    buttonAddIngredient.addEventListener("click", addIngredient);
    buttonAddPreparation.addEventListener("click", addPreparation);

    function addField(fieldContainer, fields) {
        // Realiza um clone do último ingrediente adicionado
        if(fieldContainer.length == 0) return 
        const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
    
        // Não adiciona um novo input se o último tem um valor vazio
        if (newField.children[0].value == "") return false;
    
        // Deixa o valor do input vazio
        newField.children[0].value = "";

        fields.appendChild(newField);
    }

    function addIngredient() {
        const fieldIngredients = document.querySelector("#ingredients");
        const fieldContainer = document.querySelectorAll(".ingredient");
    

        addField(fieldContainer, fieldIngredients)
    }
    
    function addPreparation() {
        const fieldPreparation = document.querySelector("#preparation");
        const fieldContainer = document.querySelectorAll(".step");

        addField(fieldContainer, fieldPreparation)
    }    

}





// Delete
const deleteButtons = document.querySelectorAll("#delete");
for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener("submit", (event) => {
        const confirmation = confirm("Você tem certeza que quer deletar a receita?")
        if (!confirmation) {
        event.preventDefault()
        }
    })
}

/* Pagination */

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage

    for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages;
        const pagesBeforeSelectedPage = selectedPage >= currentPage - 2;
        const pagesAfterSelectedPage = selectedPage <= currentPage + 2;

        if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if(oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            };
            if(oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }
            pages.push(currentPage)
            oldPage = currentPage
        }
    }
    return pages
}

function createPagination(pagination) {
    const filter = pagination.dataset.filter;
    const page = +pagination.dataset.page;
    const total = +pagination.dataset.total;
    const pages = paginate(page, total);

    let elements = "";

    for(let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span>${page}</span>`
        } else {
            if(filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            } else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");
if(pagination) {
    createPagination(pagination)
}

/* === PHOTOS UPLOAD ===*/

const PhotosUpload = {
    uploadLimit: 5,
    files: [],
    input: "",
    preview: document.querySelector("#photos-preview"),

    handleFileInput(event) {
        const {files: fileList} = event.target;
        PhotosUpload.input = event.target;
       
        if(PhotosUpload.hasLimit(event)) return
        
        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file);
            
            const reader = new FileReader();
            
            reader.onload = () => {
                const image = new Image();
                image.src = String(reader.result)
                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div) //coloca a div criada dentro do "photos-preview"
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    },

    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()
        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },

    hasLimit(event) {
        let {uploadLimit, input, preview} = PhotosUpload;
        let {files: fileList} = input;
       
        if(input.name == "chefs-photos") {
            uploadLimit = 1
        }

        if(fileList.length > uploadLimit) {
            alert(`Enviar no máximo ${uploadLimit} fotos!`)
            event.preventDefault()
            return true
        }

        const photosDiv = [];
        preview.childNodes.forEach(item => {
            if(item.classList && item.classList == "photo") {
                photosDiv.push(item)
            }
        })

        const totalPhotos = fileList.length + photosDiv.length;
        if (totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos!")
            event.preventDefault()
            return true
        }
            return false 
    },

    getContainer (image) {
        const div = document.createElement('div'); //cria uma div
        div.classList.add('photo'); //coloca uma classe 'photo' na div criada
        div.onclick = PhotosUpload.removePhoto;
        div.appendChild(image); //coloca a image na div criada
        div.appendChild(PhotosUpload.getRemoveButton());
        return div;
    },

    getRemoveButton () {
        const button = document.createElement('i');
        button.classList.add('material-icons');
        button.innerHTML = 'close';
        return button;
    },

    removePhoto(event) {
        const photoDiv = event.target.parentNode;
        const photosArray = Array.from(PhotosUpload.preview.children);
        const index = photosArray.indexOf(photoDiv);

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
        photoDiv.remove()
    },

    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode;

        if (photoDiv.id) {
            const removedFile = document.querySelector('input[name="removed_files"]')
            if (removedFile) {
                removedFile.value += `${photoDiv.id},`
            }
        }
        photoDiv.remove()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.gallery .highlight > img'),

    previews: document.querySelectorAll('.gallery_preview img'),

    setImage(e) {
        const {target} = e;

        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))

        target.classList.add('active')

        ImageGallery.highlight.src = target.src;
        LightBox.image.src = target.src;
    }
}

const LightBox = {
    target: document.querySelector('.lightbox-target'),

    image: document.querySelector('.lightbox-target img'),

    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),

    open() {
        LightBox.target.style.opacity = 1;
        LightBox.target.style.top = 0;
        LightBox.target.style.bottom = 0;
        LightBox.closeButton.style.top = 0;
    },

    close() {
        LightBox.target.style.opacity = 0;
        LightBox.target.style.top = "-100%";
        LightBox.target.style.bottom = "initial";
        LightBox.closeButton.style.top = "-80px";
    }
}   

const Validade = {
    apply(input, func) {
        Validade.clearErrors(input);

        let results = Validade[func](input.value);
        input.value = results.value;

        if(results.error)
            Validade.displayError(input, results.error)
            
    },

    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector('.error');
        if(errorDiv)
            errorDiv.remove();
    },

    displayError(input, error){
        const div = document.createElement('div');
        div.classList.add('error');
        div.innerHTML = error;
        input.parentNode.appendChild(div);
        input.focus();
    },

    isEmail(value) {
        let error = null;

        const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (!value.match(emailFormat))
            error = "Email inválido"

        return {
            error, 
            value
        }


    }
}
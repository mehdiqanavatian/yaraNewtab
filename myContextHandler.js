
const contextDiv = document.createElement('div');
const contextQuickLinksDiv = document.createElement('div');
const profilePictureDiv = document.querySelector('.userPhoto');
const firstChildDiv = document.querySelector('.firstChild');

//constructing context menu
(function () {
    contextDiv.classList.add("customContextMenu");
    contextDiv.style.width = "9.5rem";
    contextDiv.style.height = "7.40rem";


    let aAddTile = document.createElement('a');
    let aAddTileTextNode = document.createTextNode("Add Tile");
    aAddTile.href = "#";

    aAddTile.addEventListener('click', (e) => {
        document.getElementById('frmMainTileHeader').textContent = "Add Tile";
        document.getElementById('tileAdd').value = "Add";
        manageTile(null);
        contextDivClear();
        e.stopPropagation();
    });
    aAddTile.appendChild(aAddTileTextNode);
    contextDiv.appendChild(aAddTile);

    let aQLTile = document.createElement('a');
    let aQLTileTextNode = document.createTextNode("Add Quick Link");
    aQLTile.href = "#";

    aQLTile.addEventListener('click', (e) => {
        let form = document.getElementById("frmAddQuickLink");
        form.style.right = "0rem";
        contextDivClear();
        e.stopPropagation();
    });
    aQLTile.appendChild(aQLTileTextNode);
    contextDiv.appendChild(aQLTile);


    let aChangeBackground = document.createElement('a');
    let aChangeBackgroundTextNode = document.createTextNode("Change Background");
    aChangeBackground.href = "#";
    aChangeBackground.addEventListener('click', (e) => {
        document.getElementById("inputBackgroundImage").click(e);
        contextDivClear();
        e.stopPropagation();
    });
    aChangeBackground.appendChild(aChangeBackgroundTextNode);
    contextDiv.appendChild(aChangeBackground);

    let aChangeAvatar = document.createElement('a');
    let aChangeAvatarTextNode = document.createTextNode("Change Avatar");
    aChangeAvatar.href = "#";
    aChangeAvatar.addEventListener('click', (e) => {
        document.getElementById("inputProfilePicture").click(e);
        contextDivClear();
        e.stopPropagation();
    });
    aChangeAvatar.appendChild(aChangeAvatarTextNode);
    contextDiv.appendChild(aChangeAvatar);
})();
//constructing context menu

function contextDivClear() {

    if (contextDiv.parentNode) {
        contextDiv.classList.remove("active");
        contextDiv.parentNode.removeChild(contextDiv);

    }
}


function getContextDiv(div, event) {

    contextDivClear();

    if (!event.target.classList.contains('item-content')) {
        // console.log(event);
        let contextVerticalOrigin = "top";
        let contextHorizontalOrigin = "left";
        contextDiv.style.top = event.offsetY + "px";
        contextDiv.style.left = event.clientX + "px";

        if (event.offsetY > ((window.innerHeight / 5) * 3)) {
            //convert rem to pixel for height
            let contextHeight = parseFloat(contextDiv.style.height) * parseFloat(getComputedStyle(document.documentElement).fontSize)
            contextDiv.style.top = (event.offsetY - contextHeight) + "px";
            contextVerticalOrigin = "bottom";
        }
        if (event.clientX > ((window.innerWidth / 5) * 3)) {
            //convert rem to pixel for width
            let contextWidth = parseFloat(contextDiv.style.width) * parseFloat(getComputedStyle(document.documentElement).fontSize)
            contextDiv.style.left = (event.clientX - contextWidth) + "px";
            contextHorizontalOrigin = "right";

        }
        let contextDivTransformOrigin = `${contextVerticalOrigin} ${contextHorizontalOrigin}`;
        contextDiv.style.transformOrigin = contextDivTransformOrigin;
        div.appendChild(contextDiv);
    }

    setTimeout(() => {
        contextDiv.classList.add("active");
    }, 10);
}


contextDiv.addEventListener('click', function (e) {
    contextDivClear();
})

//adding context to firstChild (main desktop)
firstChildDiv.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    let tileForm = document.getElementById("frmMainTile");
    let qlForm = document.getElementById("frmAddQuickLink");
    if (e.currentTarget != tileForm && tileForm.style.right == "0rem") {
        resetTile();
    }
    if (e.currentTarget != qlForm && qlForm.style.right == "0rem") {
        resetQuickLink();
    }
    if (e.target === firstChildDiv || e.target.classList.contains("grid")) {
        getContextDiv(firstChildDiv, e);
    }
    console.log(e.target);
});

//window context menu handler
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});


window.addEventListener('click', function (e) {
    contextDivClear();

    let tileForm = document.getElementById("frmMainTile");
    let qlForm = document.getElementById("frmAddQuickLink");
    if (!e.target.classList.contains('editItem')) {
        if (e.target != tileForm && tileForm.style.right == "0rem") {
            resetTile();
        }
        if (e.target != qlForm && qlForm.style.right == "0rem") {
            resetQuickLink();
        }
    }
});


//changes avatar
document.getElementById("inputProfilePicture").addEventListener('change', function (e) {
    let file = this.files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            profilePictureDiv.style.backgroundImage = "url('" + reader.result + "')";
            MyStorageHelper.setAvatar(reader.result);
        }
    }
    else {
        profilePictureDiv.style.backgroundImage = "";
        MyStorageHelper.removeAvatar();
    }
});

//changes desktop background
document.getElementById("inputBackgroundImage").addEventListener('change', function (e) {
    let file = this.files[0];
    if (file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = function () {
            document.body.style.backgroundImage = "url('" + reader.result + "')";
            MyStorageHelper.setBackground(reader.result);
        }
    } else {
        document.body.style.backgroundImage = "";
        MyStorageHelper.removeBackground();
    }
});

//change user info
function selectTextInput() {
    this.select();
}

function updateUserInfo() {
    let userInfo = { userName, userNickName };
    userInfo.userName = document.getElementById("userName").value;
    userInfo.userNickName = document.getElementById("userNickName").value;

    MyStorageHelper.setUserInfo(userInfo);
}

document.getElementById("userName").addEventListener('focus', selectTextInput);
document.getElementById("userNickName").addEventListener('focus', selectTextInput);
document.getElementById("userName").addEventListener('change', updateUserInfo);
document.getElementById("userNickName").addEventListener('change', updateUserInfo);
document.getElementById("userName").addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        updateUserInfo();
        this.blur();
    }
});
document.getElementById("userNickName").addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        updateUserInfo();
        this.blur();
    }
});

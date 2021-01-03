class MyStorageHelper {
    static getUrls() {
        let allUrls;
        if (localStorage.getItem('YARA') === null) {
            allUrls = [];
        } else {
            allUrls = JSON.parse(localStorage.getItem('YARA'));
        }

        return allUrls;
    }

    static addUrl(MyUrl) {
        const allUrls = MyStorageHelper.getUrls();

        allUrls.push(MyUrl);

        localStorage.setItem('YARA', JSON.stringify(allUrls));
    }

    static removeUrl(url) {
        const allUrls = MyStorageHelper.getUrls();

        allUrls.forEach((el, index) => {
            if (el.url === url) {
                allUrls.splice(index, 1);
            }
        });

        localStorage.setItem('YARA', JSON.stringify(allUrls));
    }

    //user info
    static getUserInfo() {
        let userInfo;
        chrome.storage.local.get(["userInfo"], function (result) {
            if (result.userInfo) {
                userInfo = result.userInfo;
                document.getElementById("userName").value = userInfo.userName;
                document.getElementById("userNickName").value = userInfo.userNickName;
            }
        });
    }

    static setUserInfo(value) {
        chrome.storage.local.set({"userInfo": value});
    }

    //background and avatar
    static setBackground(value) {
        chrome.storage.local.set({ 'background': value });
    }
    static getBackground() {
        let bckgrnd;
        chrome.storage.local.get(["background"], function (result) {
            if (result.background) {
                bckgrnd = result.background;
                document.body.style.backgroundImage = "url('" + bckgrnd + "')";
            }
        });
    }
    static removeBackground() {
        chrome.storage.local.remove('background');
    }

    static setAvatar(value) {
        chrome.storage.local.set({ 'avatar': value });
    }
    static getAvatar() {
        let avtr;
        chrome.storage.local.get(["avatar"], function (result) {
            if (result.avatar) {
                avtr = result.avatar;
                let avatar = document.querySelector('.userPhoto');

                avatar.style.backgroundImage = "url('" + avtr + "')";
            }
        });
    }
    static removeAvatar() {
        chrome.storage.local.remove('avatar');
    }





    //quick links
    static setQuickLinks(QL) {
        chrome.storage.local.set({ 'quickLinks': QL });
    }

    static getQuickLinks() {



        let quickLinks;
        chrome.storage.local.get(["quickLinks"], function (result) {
            if (result.quickLinks) {
                quickLinks = result.quickLinks;
                let ql = document.querySelectorAll(".quickLinks");
                ql[0].innerHTML = quickLinks;
                QuickLinkRemover(ql[0].childNodes);
            }
        });

        let allQuickLinks;
        if (localStorage.getItem('quickLinks') === null) {
            allQuickLinks = [];
        } else {
            allQuickLinks = localStorage.getItem('quickLinks');
        }

        return allQuickLinks;
    }


    //main tiles
    static prepareMainTiles() {
        let cols = document.querySelectorAll(".col");
        let tiles = [];
        cols.forEach((col, colIndex) => {
            col.childNodes.forEach((grid, gridIndex) => {
                grid.childNodes.forEach((tile, tileIndex) => {
                    let myTile = new MyUrl();
                    myTile.img = tile.style.backgroundImage;
                    myTile.title = tile.querySelector('a').text;
                    myTile.bgColor = tile.style.backgroundColor;
                    myTile.txtColor = tile.style.color;
                    myTile.url = tile.querySelector('a').href;
                    myTile.colIndex = colIndex;
                    myTile.tileIndex = tileIndex;
                    switch (true) {
                        case tile.classList.contains('small'):
                            myTile.size = 'small';
                            break;
                        case tile.classList.contains('medium'):
                            myTile.size = 'medium';
                            break;
                        case tile.classList.contains('large'):
                            myTile.size = 'large';
                            break;
                        case tile.classList.contains('wide'):
                            myTile.size = 'wide';
                            break;
                        case tile.classList.contains('tall'):
                            myTile.size = 'tall';
                            break;
                    }
                    tiles.push(myTile);
                });
            });
        });
        return tiles;
    }
    static setMainTiles(tiles) {
        chrome.storage.local.set({ 'mainTiles': tiles });
    }

    static editMainTiles(){

    }
    
    static getMainTiles() {

        chrome.storage.local.get(["mainTiles"], function (result) {
            if (result.mainTiles) {
                // console.log(result.mainTiles);
                let cols = [];

                result.mainTiles.forEach((tile, index) => {
                    let newTile = document.getElementById("tilePreview").cloneNode(true);
                    newTile.removeAttribute('id');
                    newTile.classList.remove('itemPRV');
                    newTile.classList.remove('small');
                    newTile.classList.remove('medium');
                    newTile.classList.remove('large');
                    newTile.classList.remove('wide');
                    newTile.classList.remove('tall');
                    newTile.setAttribute('data-index',tile.tileIndex);
                    newTile.querySelector('a').href = tile.url;
                    if (tile.title != "") { newTile.querySelector('a').text = tile.title; }
                    if (tile.bgColor != "") { newTile.style.backgroundColor = tile.bgColor; }
                    if (tile.txtColor != "") { newTile.style.color = tile.txtColor; }
                    if (tile.img != "") { newTile.style.backgroundImage = tile.img; }
                    switch (tile.size) {
                        case 'small':
                            newTile.classList.add('small');
                            break;
                        case 'medium':
                            newTile.classList.add('medium');
                            break;
                        case 'large':
                            newTile.classList.add('large');
                            break;
                        case 'wide':
                            newTile.classList.add('wide');
                            break;
                        case 'tall':
                            newTile.classList.add('tall');
                            break;
                    }
                    if (cols.length > tile.colIndex) {
                        cols[tile.colIndex].querySelector(".grid").appendChild(newTile);
                    } else {

                        let count = tile.colIndex - cols.length;
                        for (let index = 0; index <= count; index++) {


                            let col = document.createElement('div');
                            col.className = "col";
                            let grid = document.createElement('div');
                            grid.className = "grid";
                            col.appendChild(grid);

                            cols.push(col);
                        }
                        cols[tile.colIndex].querySelector(".grid").appendChild(newTile);
                    }
                });

                // col.appendChild(grid);
                cols.forEach(element => {
                    if (element.querySelector(".grid").hasChildNodes()) {
                        firstChildDiv.appendChild(element);
                        addGrid(element.querySelector(".grid"));
                    }
                    // console.log(element.querySelector(".grid"));
                });


            }
        })
    }
}
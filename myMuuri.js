let cols = document.querySelectorAll('.col');
let grids = document.querySelectorAll('.grid');
let allMuuriGrids = [];
let dragSortArray = [];
let newGridID = 0;
let currentDragGridCheck;
let currentDragAnchor;


function addGrid(grid) {

    cols = document.querySelectorAll('.col');
    grids = document.querySelectorAll('.grid');

    let gIndex = "grid" + newGridID;
    newGridID++;

    grid.classList.add(gIndex)
    dragSortArray.push(gIndex);

    gIndex = "." + gIndex;

    let muuriGrid = new Muuri(gIndex, {
        dragEnabled: true,
        dragContainer: null,
        dragPlaceholder: {
            enabled: true,
            createElement(item) {
                let clone = item.getElement().cloneNode(true)
                clone.style.opacity = 0.5;
                return clone;
            },
        },
        dragSort: function () {
            return allMuuriGrids;
        },
        dragStartPredicate: {
            distance: 20
        }
    });


    allMuuriGrids.push(muuriGrid);

    muuriGrid.getElement().addEventListener('click', function (e) {
        if (e.target.matches('.removeItem')) {
            let item = muuriGrid.getItem(e.target.closest('.muuri-item'));
            let g = item.getGrid();
            g.synchronize();
            g.remove([item], { removeElements: true });
            let items = g.getItems();
            if (items.length === 0) {
                g.destroy();
                allMuuriGrids.splice(allMuuriGrids.indexOf(g), 1);
                dragSortArray.splice(dragSortArray.indexOf(g.getElement().classList[1]), 1);
                g.getElement().parentNode.remove();
            }
            window.setTimeout(() => {
                MyStorageHelper.setMainTiles(MyStorageHelper.prepareMainTiles());
            }, 10);
        }
        if (e.target.matches('.editItem')) {
            let item = e.target.closest('.muuri-item');
            let url = new MyUrl();
            url.title = item.querySelector("a").textContent;
            url.url = item.querySelector("a").getAttribute("href");
            if (window.getComputedStyle(item, null).getPropertyValue("background-image")) url.img = item.style.backgroundImage;
            if (window.getComputedStyle(item, null).getPropertyValue("background-color")) url.bgColor = item.style.backgroundColor;
            if (window.getComputedStyle(item, null).getPropertyValue("color")) url.txtColor = item.style.color;

            switch (true) {
                case item.classList.contains('small'):
                    url.size = 'small';
                    break;
                case item.classList.contains('medium'):
                    url.size = 'medium';
                    break;
                case item.classList.contains('large'):
                    url.size = 'large';
                    break;
                case item.classList.contains('wide'):
                    url.size = 'wide';
                    break;
                case item.classList.contains('tall'):
                    url.size = 'tall';
                    break;
            }

            document.getElementById('frmMainTileHeader').textContent = "Edit Tile";
            document.getElementById('tileAdd').value = "Update";
            manageTile(url,item);
        }
    });

    muuriGrid.on('dragStart', function (item, event) {
        currentDragGridCheck = item.getGrid();
        let element = item.getElement();
        currentDragAnchor = element.querySelector(".item-content a").getAttribute('href');
        element.querySelector(".item-content a").removeAttribute('href');
    });


    muuriGrid.on('dragReleaseEnd', function (item) {
        let itemAnchor = item.getElement();
        itemAnchor.querySelector(".item-content a").setAttribute('href', currentDragAnchor);
        if (currentDragGridCheck) {
            let pastGridItems = currentDragGridCheck.getItems();
            if (pastGridItems.length === 0) {

                currentDragGridCheck.destroy();
                allMuuriGrids.splice(allMuuriGrids.indexOf(currentDragGridCheck), 1);
                dragSortArray.splice(dragSortArray.indexOf(currentDragGridCheck.getElement().classList[1]), 1);
                currentDragGridCheck.getElement().parentNode.remove();
                currentDragGridCheck = null;
            }
        }

        let grid = item.getGrid();
        grid.synchronize();

        window.setTimeout(() => {
            MyStorageHelper.setMainTiles(MyStorageHelper.prepareMainTiles());
        }, 10);
    });
}

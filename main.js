
//no need to the following comments
// const vh= window.innerHeight * 0.01;
// document.documentElement.style.setProperty('--vh',`${vh}px`);

// setTimeout(function () {
//    window.scrollTo(0,1); 
// },0)


(function () {
    MyStorageHelper.getAvatar();
    MyStorageHelper.getBackground();
    MyStorageHelper.getQuickLinks();
    MyStorageHelper.getMainTiles();
    MyStorageHelper.getUserInfo();
})();

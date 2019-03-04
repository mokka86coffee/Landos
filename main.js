function showInfo(modal,e) {
    e.stopPropagation();
    e.preventDefault();
    modal.classList.add('modal--ready'); 
}

function createNode(tag, attr, parentNode) {
    let node = document.createElement(tag);
    if ('className' in attr ) { node.className = attr['className'] }
    if ('src' in attr ) { node.setAttribute('src', attr['src']) }
    if ('text' in attr ) { node.innerText = attr['text'] }
    parentNode.append(node);
    return node;
}

async function ajaxGetData(str) {
    return JSON.parse( await
        jQuery.ajax({
            method: "POST",
            url: "functions.php",
            data: str
        })
        .done( function( json ) {
            return json;
        }) 
    );
}

async function showMenu(modal, e) {
    e.stopPropagation();
    e.preventDefault();
    let path = e.path[0].dataset.menu ? e.path[0].dataset.menu : e.path[1].dataset.menu;
    
    let menuDivNode = document.querySelector('.modal-menu__content');
    menuDivNode.innerHTML = '';

    let menuObj = await ajaxGetData(`bluda_id=${path}`);
    
    for (let key in menuObj) {
        if (key === 'title') { document.querySelector('.modal-menu__info-title').innerText = menuObj['title']; continue; }
        if (key === 'img') { document.querySelector('.modal-menu__img').setAttribute('src',menuObj['img']); continue; }
        
        let parentPNode = createNode('p', {}, menuDivNode);
        createNode('span', { className: 'content__item content__item--first', text: key }, parentPNode);
        createNode('span', { className: 'content__item content__item--dotted' }, parentPNode);
        createNode('span', { className: 'content__item content__item--last', text: `${menuObj[key]} ₽` }, parentPNode);
    }

    modal.classList.add('modal--ready');
}

function showPhotos(modal, e) {
    e.stopPropagation();
    e.preventDefault();
    modal.classList.add('modal--ready');
}

function renderPhotos(e, parentDiv) {
    $('.modal-photos__tabs li').node.forEach(el=>el.className = '');
    if (e) { e.target.className = 'active' }
    else { $('.modal-photos__tabs li').node[0].className = 'active' }

    let title = e ? e.target.dataset.text : $('.modal-photos__tabs li').node[0].dataset.text;
    parentDiv.innerHTML = '';
    this.index = 0;

    this.slides[title].forEach( (el,i) => {
        let div = createNode('div', { className: `modal-photos__img ${i===0 ? 'modal-photos__img--active' : ''}` }, parentDiv );
        createNode('img', { src: el.url}, div);
    });

    this.nodes = $('.modal--photos-halls .modal-photos__img').node;

    $('.modal--photos-halls .modal-photos__arrow').node.forEach(n=>n.onclick = toggleSlide.bind(this, this.nodes, 'halls'));
}

function chngIndex(right, quanity, index) {
return right
    ? index +1 < quanity
        ? index +1  
        : 0
    : index -1 < 0
        ? quanity-1
        : index -1;
}

let toggleSlide = function (slides, name, { target: { classList: { value } } }) {
    
    let 
        slideToRight = ~value.indexOf('right'),
        slidesQuanity = slides.length,
        currentIndex = this.index
    ; 

    if ( name === 'halls' ) {
        currentIndex = chngIndex(slideToRight, slidesQuanity, currentIndex);
        let prevSlide = chngIndex(slideToRight ? !slideToRight : slideToRight, slidesQuanity, currentIndex),
            nextSlide = chngIndex(slideToRight ? slideToRight : !slideToRight, slidesQuanity, currentIndex);
        
        slides[currentIndex].className = `modal-photos__img modal-photos__img--active`;
        slides[prevSlide].className = `modal-photos__img modal-photos__img--prev`;
        slides[nextSlide].className = `modal-photos__img modal-photos__img--next`;
    } else {
        slides[currentIndex].className = `modal-photos__img`;
        currentIndex = chngIndex(slideToRight, slidesQuanity, currentIndex);
        slides[currentIndex].className = `modal-photos__img modal-photos__img--active`;
    }

    this.index = currentIndex;
}

let $=( tag, _$={
node: document.querySelectorAll(tag),
method: (event,func)=> 
    (_$.node
        .forEach(n=>
            n.addEventListener(event, func, true) ), 
        _$
    )
}) => _$;

window.onload = async () => {
    $('.preloader').node[0].classList.add('hidden');
    await (async function (){ for (let node of document.getElementsByTagName('img')) { 
        await new Promise(res=>{ 
            node.src=node.dataset.src; 
            node.dataset.src=''; 
            node.onerror=(err)=>{
                console.log(err); 
                res();
            }
            node.onload = ()=>res(); 
        }) 
    } })();
    //  Imgs one by one loading

    $('.modal').method('click', (e) => e.target.classList.remove('modal--ready'));
    $('.modal__close').method('click', (e) => e.target.parentNode.parentNode.classList.remove('modal--ready'));
    // modal hide on click

    $('.services__item--about').method('click', showInfo.bind({}, $('.modal--info').node[0]));
    // show/hide restaurant info

    $('[data-href="contacts"]').method('click', showInfo.bind({}, $('.modal--contacts').node[0]));
    // show/hide restaurant contacts

    $('.dishes__item, .footer-nav__column--menu').method('click', showMenu.bind({}, $('.modal--menu').node[0]));
    // show/hide restaurant menu


    let hallsObj = { index: 0, slides: await ajaxGetData(`halls=${true}`), nodes: $('.modal--photos-halls .modal-photos__img').node };
    let hallsDiv = $('.modal-photos__slide').node[0];

    renderPhotos = renderPhotos.bind(hallsObj);
    renderPhotos(null, hallsDiv);


    $('.services__item--gallery, [data-href="gallery"]').method('click', showPhotos.bind({}, $('.modal--photos-halls').node[0]));
    // show/hide restaurant halls photos
    
    $('[data-text]').method('click', e=>renderPhotos(e,hallsDiv) );
    // toggle restaurant halls photos




    $('[data-href="news"]').method('click', showPhotos.bind({}, $('.modal--photos-news').node[0]));
    // show/hide restaurant news photos

    $('.modal--photos-news .modal-photos__arrow').method('click', toggleSlide.bind({index: 0}, $('.modal--photos-news .modal-photos__slider img').node, 'news'));
    // toggle slides restaurant news photos
};

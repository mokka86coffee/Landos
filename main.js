function orderTable(modal,e) {
    e.stopPropagation();
    modal.classList.add('modal--ready'); 
}

function showInfoAbout(e) {
    this.onclick = null;
    document.querySelector('.info').classList.toggle('info--hidden');
} 

function showMenu(modal, e) {
    e.stopPropagation();
    modal.classList.add('modal--ready');
}

function showPhotos(modal, e) {
    e.stopPropagation();
    modal.classList.add('modal--ready');
}

let toggleSlide = (slides, { target: { classList: { value } } }, current) => {
	
    let name = 'modal-photos__img';
    slides[current.value].className = `${name} ${name}--prev`;

    let currentValue = current.value;
    setTimeout(()=>slides[currentValue].className = `${name} ${name}--next`,600);
    
    
    let quanity = slides.length -1;
    let direction = ~value.indexOf('right') ? 'r' : 'l';
    current.value =  direction === 'r'
        ? current.value +1 < quanity
            ? current.value +1  
            : 0
        : current.value -1 < 0
            ? quanity
            : current.value -1;
            
    slides[current.value].className = `${name} ${name}--active`;
}

let sliderDecorator = function (func) {
    let current = {
        value: 0
    };
    return function() {
        let args = [...arguments, current];
        return func.apply(this,args);
    }
}

toggleSlide = sliderDecorator(toggleSlide);


let $=( tag, _$={
    node: document.querySelectorAll(tag),
    method: (event,func)=> 
        (_$.node
            .forEach(n=>
                n.addEventListener(event, func) ), 
            _$
        )
    }) => _$;

window.onload = () => {
    (async function (){ for (let node of document.getElementsByTagName('img')) { await new Promise(res=>{ node.src=node.dataset.src; node.dataset.src=''; node.onload = ()=>res();}) } })();
    //  Imgs one by one loading

    document.querySelector('.services__item--about').onclick = showInfoAbout;
    // show/hide info about restaurant

    $('.modal').method('click', (e) => e.target.classList.remove('modal--ready'));
    // modal hide on click
    
    $('.services__item--booking').method('click', orderTable.bind({}, $('.modal--booking').node[0]));
    // booking a table

    $('.dishes__item').method('click', showMenu.bind({}, $('.modal--menu').node[0]));
    // show/hide restaurant menu
    
    $('.services__item--gallery').method('click', showPhotos.bind({}, $('.modal--photos').node[0]));
    // show/hide restaurant menu

    $('.modal-photos__arrow').method('click', toggleSlide.bind({}, $('.modal-photos__slider img').node))
};

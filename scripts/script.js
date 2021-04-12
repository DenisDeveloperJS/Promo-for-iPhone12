'use strict';
import createNegativeArrayIndex from './app.js'

document.addEventListener('DOMContentLoaded', () => {
    const cardDetailsTitle = document.querySelectorAll('.card-details__title_all h2');
    const cardDetailButtons = document.querySelector('.card-detail__buttons');
    const cardDetailChangeElem = cardDetailButtons.querySelectorAll('.card-detail__change');
    const cardImagesElems = document.querySelectorAll('.card__image');
    const memoryROM = document.querySelector('#memory-rom');
    const characteristicsList = document.querySelector('.characteristics__list');
    const characteristicsDescription = document.querySelectorAll('.characteristics__description');
    const modalTitle = document.querySelector('.modal__title');

    const data = [
        {
            name: "Смартфон Apple iPhone 12 Pro 128GB Graphite",
            img: "img/iPhone-graphite.png",
            price: 95990,
            memoryROM : 128,
        },
        {
            name: "Смартфон Apple iPhone 12 Pro 256GB Silver",
            img: "img/iPhone-silver.png",
            price: 120990,
            memoryROM : 256,
        },
        {
            name: "Смартфон Apple iPhone 12 Pro 128GB Pacific Blue",
            img: "img/iPhone-blue.png",
            price: 99990,
            memoryROM : 128,
        },
    ];

    const getData = (url, callback) => {
        const request = new XMLHttpRequest();

        request.open('GET', url);

        request.send();

        request.onreadystatechange = e => {
            if(request.readyState !== 4) return false;
            if(request.status === 200){ 
                const response = JSON.parse(request.response);
                callback(response);
            } else {
                throw new Error('Error...')
            }
        }
    }

    const tabs = () => {
        cardDetailButtons.addEventListener('click', e => {
            const target = e.target.closest('button');

            if(target){
                const cardActive = () => {
                    if(!target.classList.contains('active')) {
                        for(let i = 0; i < cardDetailChangeElem.length; i++) {
                            cardDetailChangeElem[i].classList.remove('active');
                            target.classList.add('active');
    
                            cardDetailsTitle[i].classList.remove('active');
                            cardDetailsTitle[target.dataset.colorCard].classList.add('active');
                            modalTitle.textContent = data[target.dataset.colorCard].name;
                        
                            if(target.dataset.colorCard == 1) {
                                memoryROM.textContent = data[1].memoryROM;
                            }
                            else {
                                memoryROM.textContent = 128;
                            }

                            cardImagesElems[i].classList.remove('active');
                            cardImagesElems[target.dataset.colorCard].classList.add('active');

                            prise.textContent = data[target.dataset.colorCard].price;
                            
                        }
                    }
                }
                cardActive();
            }
        });
    }


    const activeCharacteristics = () => {
        characteristicsList.addEventListener('click', e => {
            const children = characteristicsList.children;
            const target = e.target.closest('li');

            if(target) {
                if(!target.children[1].classList.contains('active')) {
                    for(let i = 0; i < children.length; i++) {
                        const dataset = target.dataset.characteristics;
                        characteristicsDescription[dataset].classList.add('active');
                    }
                } else {
                    target.children[1].classList.remove('active');
                }
            }
        });
        document.body.addEventListener('click', (e) => {
            const children = characteristicsList.children;
            const target = e.target;

            if (!target.closest('.characteristics__list')) {
                for(let i = 0; i < children.length; i++) {
                    children[i].children[1].classList.remove('active');
                }
            }
        });
    }  


    const modal = () => {
        const cardDetailsButtonBuy = document.querySelector('.card-details__button_buy');
        const cardDetailsButtonDelivery = document.querySelector('.card-details__button_delivery');
        const modalSubsite = document.querySelector('.modal__subtitle');
        const modal = document.querySelector('.modal');
        const modalBuy = document.querySelector('.modal__submit');

        const openModalBuy = () => {
            cardDetailsButtonBuy.addEventListener('click', () => {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
                modalSubsite.textContent = 'Оплата';
                modalBuy.textContent = 'Оплата';
                document.addEventListener('keydown', escapeHudler);
            });
        };
        
        const openModalDelivery = () => {
            cardDetailsButtonDelivery.addEventListener('click', () => {
                modal.classList.add('open');
                document.body.style.overflow = 'hidden';
                modalSubsite.textContent = 'Доставка и оплата';
                modalBuy.textContent = 'Доставка и оплата';
                document.addEventListener('keydown', escapeHudler);
            });
        }

        const closeModal = () => {
            modal.addEventListener('click', event => {
                const target = event.target;
                if(target.classList.contains('modal__close') || target === modal) {
                    modal.classList.remove('open');
                    document.body.style.overflow = '';
                }
            });
        }

        const escapeHudler = () => {
            if(event.key === 'Escape' || event.keyCode === '27' || event.which === '27') {
                modal.classList.remove('open');
                document.body.style.overflow = '';
           };   
        }
        
        openModalBuy();
        openModalDelivery();
        closeModal();
    }

    getData("/cross-sell-dbase/dbase.json", response => {
        const crossSellList = document.querySelector('.cross-sell__list');
        const sellsAddRecomandate = document.querySelector('.sells-add-recomandate');
        const lengthcrossSellList = 4;
        let count = [];
        let allGuds = response.slice();
        
        let {length} = response;
        let random = Math.round(Math.random() * length);

        const randomItem = (arr, remaingGuds) => {
            if(random <= length && !arr.length && random > 3) {
                random = random - lengthcrossSellList;
            }
            if(!arr.length || arr.length !== 4) {
                if(typeof arr[0] === 'undefined') {
                    arr[0] = random;
                    allGuds.splice(random, 1);
                }

                arr.push(++random);
                allGuds.splice(random, 1);
                
                randomItem(count, allGuds);
            } else {
                return true;
            }

        }
        randomItem(count, allGuds);

        const randomItemAddItem = () => {
            count = [];
            randomItem(count, allGuds);
            addFourItems(count);
        }


        const addFourItems = count => {

            for(let i = count[0]; i <= count[count.length - 1]; i++) {
            const crossSellLi = document.createElement('li');

            crossSellLi.insertAdjacentHTML('afterbegin', `
                <article class="cross-sell__item">
                    <img class="cross-sell__image" src="${response[i].photo}" alt="">
                    <h3 class="cross-sell__title">${response[i].name}</h3>
                    <p class="cross-sell__price"><span class="prise-recomandate">${response[i].price}</span> &#8381</p>
                    <div class="button button_buy cross-sell__button">Купить</div>
                </article>
            `);

            crossSellList.append(crossSellLi);
            }
        }
        addFourItems(count);

        sellsAddRecomandate.addEventListener('click', () => {
            randomItemAddItem();
        });

    });

    
    tabs();
    activeCharacteristics();
    modal();
    amenu('.header__menu', '.header-menu__list', '.header-menu__item', '.header-menu__burger');
});


/*   I know that this code has a smell, but I also know that I can do better.  */

(function () {

    class Card {
        constructor(r, t, c, f, id) {
            this.visible = false,
                this.rank = r,
                this.type = t,
                this.color = c,
                this.face = f,
                this.cardId = id,
                this.back = 'obl5.gif'
        }
    }

    init = {
        deck: [],
        deck2: [],
        arrhandOutCards: [],
        arrOfCardsPlaces: [[], [], [], [], [], [], []],
        finishinDecks: [[], [], [], []],
        draggableСards: [],
        numhandOutCards: 1,
        typesOfCards: ['spade', 'club', 'diamond', 'heart'],
        colorsOfCards: ["black", "red"],
        startButton: document.getElementById('start'),
        start: document.getElementById('deck'),
        handOutPlace: document.getElementById('handOutPlace'),
        plase7: document.getElementById('cardsPlace6'),
        canDrop: false,
        insertFrom: undefined,
        parentElement: undefined,

    }

    class Game {
        constructor() {
            this.init = init;
            this.init.startButton.addEventListener('click', this.startGame.bind(this));
            this.init.start.addEventListener('click', this.handOutCards.bind(this));
            document.addEventListener('dragstart', this.dragCards.bind(this));
            document.addEventListener('dragenter', this.dragEnter.bind(this));
            document.addEventListener('dragover', this.dragOver.bind(this));
            document.addEventListener('drop', this.dropCards.bind(this));
            document.addEventListener('dblclick', this.sendCardsHome.bind(this));

        }

        startGame() {
            if (this.init.deck.length == 0) {
                this.creatCards();
            }
            else {
                this.destroyСards();
                this.creatCards();
            }
        }

        destroyСards() {
            for (let i = 0; i <= this.init.deck2.length - 1; i++) {
                document.getElementById(this.init.deck2[i].cardId).remove();
            }
            this.init.deck2 = [];
            this.init.deck = [];
            this.init.arrhandOutCards = [];
            this.init.arrOfCardsPlaces = [[], [], [], [], [], [], []];
            this.init.finishinDecks = [[], [], [], []];
            this.init.draggableСards = [];
        }

        creatCards() {

            //Проверяем, по сколько карт раздавать
            (document.getElementById('checkbox').checked) ? this.init.numhandOutCards = 3 : this.init.numhandOutCards = 1;
            let el = document.createElement("img"), el2, margTop = 0;

            function creatObj(color, type) {

                //Создаем экземпляры карт и помещаем их в массив (колоду)
                for (let i = 0; i <= 12; i++) {
                    this.init.deck.push(new Card(i, type, color, i + type + ".gif", i + type));
                    this.init.deck2.push(new Card(i, type, color, i + type + ".gif", i + type));
                }
            }
            creatObj.call(this, this.init.colorsOfCards[0], this.init.typesOfCards[0]);
            creatObj.call(this, this.init.colorsOfCards[0], this.init.typesOfCards[1]);
            creatObj.call(this, this.init.colorsOfCards[1], this.init.typesOfCards[2]);
            creatObj.call(this, this.init.colorsOfCards[1], this.init.typesOfCards[3]);

            // Перемешиваем массив с картами
            for (let i = this.init.deck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i));
                [this.init.deck[i], this.init.deck[j]] = [this.init.deck[j], this.init.deck[i]];
            }

            // Формируем колоду из "img" элементов
            el.src = "img/gifsOfCards/";
            el.style.position = "absolute";
            el.draggable = false;
            for (let i = 0; i <= 51; i++) {
                el2 = el.cloneNode(false);
                el2.src += this.init.deck[i].back;
                el2.id = this.init.deck[i].cardId;
                this.init.start.appendChild(el2);
            }

            //Размещаем карты на поле
            for (let j = 1; j <= 7; j++) {
                this.init.arrOfCardsPlaces[j - 1] = this.init.arrOfCardsPlaces[j - 1].concat(this.init.deck.splice(this.init.deck.length - j, j));
                for (let i = 1; i <= this.init.arrOfCardsPlaces[j - 1].length; i++) {
                    el = document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 1].cardId);

                    //Если это последняя карта в данной колоде, то открываем ее
                    if (i == this.init.arrOfCardsPlaces[j - 1].length) {
                        this.init.arrOfCardsPlaces[j - 1][i - 1].visible = true;
                        el.draggable = true;
                        el.src = "img/gifsOfCards/" + this.init.arrOfCardsPlaces[j - 1][i - 1].face;
                    }
                    el.style.marginTop = margTop + "px";
                    document.getElementById("cardsPlace" + j).appendChild(el);
                    margTop += 5;
                }
                margTop = 0;
            }
        }

        handOutCards() {
            let el, margLeft = 0;

            //Если в колоде карт не осталось, а в прикупе карты есть, то возвращаем карты из прикупа в колоду
            if (this.init.arrhandOutCards.length > 0 && this.init.deck.length == 0) {
                for (let i = 0; i <= this.init.arrhandOutCards.length - 1; i++) {
                    el = document.getElementById('handOutPlace').lastElementChild;
                    el.style.marginLeft = "0px";
                    el.style.marginTop = "0px";
                    el.src = "img/gifsOfCards/" + this.init.arrhandOutCards[i].back;
                    document.getElementById('deck').appendChild(el);
                }
                this.init.deck = this.init.arrhandOutCards.reverse();
                this.init.arrhandOutCards = [];
            }

            else {

                //Если карты в прикупе остались и мы раздаем новые, то последнюю из предидущей раздачи далаем недвижимой.
                if (this.init.arrhandOutCards.length > 0) {
                    document.getElementById(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].cardId).draggable = false;
                }

                // Раздаем карты в прикуп
                if (this.init.deck.length > 0) {
                    for (let i = 1; i <= this.init.numhandOutCards; i++) {
                        if (this.init.deck[this.init.deck.length - 1]) {
                            el = document.getElementById(this.init.deck[this.init.deck.length - 1].cardId);
                            el.src = "img/gifsOfCards/" + this.init.deck[this.init.deck.length - 1].face;
                            el.style.marginLeft = margLeft + "px";
                            el.style.marginTop = 7 + "px";
                            margLeft += 20;
                            this.init.handOutPlace.appendChild(el);
                            this.init.arrhandOutCards = this.init.arrhandOutCards.concat(this.init.deck.splice(this.init.deck.length - 1, 1));
                            if (i == this.init.numhandOutCards) {
                                el.draggable = true;
                            }
                        }
                    }
                }

            }
        }

        dragCards(e) {
            e.dataTransfer.setData("text", e.target.id);
            this.init.insertFrom = e.target.parentElement;
        }

        dragEnter(e) {
            if (e.target.className == 'cardsPlace') {
                this.init.parentElement = document.getElementById(e.target.id);
                this.init.canDrop = true;
            }
        }

        dragOver(e) {
            if (this.init.canDrop == true) {
                e.preventDefault();
            }
        }

        dropCards(event) {
            let el, data, lastEl, insertEl, lasttElementId, lasttElementColor, lasttElementrank, insertElColor,
                insertElRank;
            data = event.dataTransfer.getData('text');
            insertEl = document.getElementById(data);
            if (this.init.parentElement.children.length > 0) {
                lasttElementId = this.init.parentElement.lastElementChild.id;
                lastEl = document.getElementById(lasttElementId);
                function searchСard(id) {
                    if (this.init.arrhandOutCards.length > 0 && this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].cardId == id) {
                        return [this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].color, this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].rank]
                    }
                    else {
                        for (let j = 1; j <= 7; j++) {
                            for (let i = 1; i <= this.init.arrOfCardsPlaces[j - 1].length; i++) {
                                if (this.init.arrOfCardsPlaces[j - 1][i - 1].cardId == id)
                                    return [this.init.arrOfCardsPlaces[j - 1][i - 1].color, this.init.arrOfCardsPlaces[j - 1][i - 1].rank];
                            }
                        }
                    }
                }
                [lasttElementColor, lasttElementrank] = [searchСard.call(this, lasttElementId)[0], searchСard.call(this, lasttElementId)[1]];
                [insertElColor, insertElRank] = [searchСard.call(this, data)[0], searchСard.call(this, data)[1]];
                if (lasttElementrank - 1 == insertElRank && lasttElementColor != insertElColor) {
                    insertEl.style.marginLeft = '0px';
                    insertEl.style.marginTop = parseInt(lastEl.style.marginTop) + 20 + "px";
                    this.init.parentElement.appendChild(insertEl);
                    draging.call(this);
                }
            }
            //Если вставляем на пустое место
            else {
                if (insertEl.id[0] == 1 && insertEl.id[1] == 1) {
                    insertEl.style.marginTop = "0px";
                    insertEl.style.marginLeft = "0px";
                    this.init.parentElement.appendChild(insertEl);
                    draging.call(this);
                }
            }

            function draging() {

                // Проверяем откуда взяли карту.
                if (this.init.insertFrom.id == 'handOutPlace') {
                    this.init.arrOfCardsPlaces[this.init.parentElement.id[10] - 1] = this.init.arrOfCardsPlaces[this.init.parentElement.id[10] - 1].concat(this.init.arrhandOutCards.splice(this.init.arrhandOutCards.length - 1));
                    if (this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1]) {
                        document.getElementById(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].cardId).draggable = true;
                    }
                }
                else {

                    //Забираем захваченную карту и все карты, лежащие на ней. Помещаем их в массив перемещаемых карт.
                    for (let j = 1; j <= 7; j++) {
                        for (let i = 1; i <= this.init.arrOfCardsPlaces[j - 1].length; i++) {
                            if (this.init.arrOfCardsPlaces[j - 1][i - 1].cardId == insertEl.id) {
                                this.init.draggableСards = this.init.arrOfCardsPlaces[j - 1].splice(i - 1);
                            }
                        }
                    }

                    //Вставляем карты на новое место
                    this.init.arrOfCardsPlaces[this.init.parentElement.id[10] - 1] = this.init.arrOfCardsPlaces[this.init.parentElement.id[10] - 1].concat(this.init.draggableСards);
                    //если перемещается больше одной карты, то вставляем рисунки карт на новое место
                    if (this.init.draggableСards.length > 1) {
                        for (let i = 1; i <= this.init.draggableСards.length - 1; i++) {
                            insertEl = document.getElementById(this.init.draggableСards[i].cardId);
                            lasttElementId = this.init.parentElement.lastElementChild.id;
                            lastEl = document.getElementById(lasttElementId);
                            insertEl.style.marginTop = parseInt(lastEl.style.marginTop) + 20 + "px";
                            this.init.parentElement.appendChild(insertEl);
                        }
                    }

                    //После перемещения всех карт, обнуляем массив перемещаемых карт
                    this.init.draggableСards.length = 0;
                }
                //Если это последняя карта в данной колоде, то открываем ее
                for (let j = 1; j <= 7; j++) {
                    for (let i = 1; i <= this.init.arrOfCardsPlaces[j - 1].length; i++) {
                        el = document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 1].cardId);
                        if (i == this.init.arrOfCardsPlaces[j - 1].length && this.init.arrOfCardsPlaces[j - 1][i - 1].visible == false) {
                            this.init.arrOfCardsPlaces[j - 1][i - 1].visible = true;
                            el.draggable = true;
                            el.src = "img/gifsOfCards/" + this.init.arrOfCardsPlaces[j - 1][i - 1].face;
                        }
                    }
                }
            }
        }

        sendCardsHome(e) {
            let color, rank, i, j, u = 1, id, el, from, length, type;
            function searchСard(id) {
                if (this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1] && this.init.arrhandOutCards.length > 0 && this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].cardId == id) {
                    return [this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].color, this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].rank, j, i, 'arrhandOutCards',
                        this.init.arrhandOutCards.length, this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].type]
                }
                else {
                    for (let j = 1; j <= 7; j++) {
                        for (let i = 1; i <= this.init.arrOfCardsPlaces[j - 1].length; i++) {
                            if (this.init.arrOfCardsPlaces[j - 1][i - 1] && this.init.arrOfCardsPlaces[j - 1][i - 1].cardId == id)
                                return [this.init.arrOfCardsPlaces[j - 1][i - 1].color, this.init.arrOfCardsPlaces[j - 1][i - 1].rank, j, i, 'arrOfCardsPlaces', this.init.arrOfCardsPlaces[j - 1].length, this.init.arrOfCardsPlaces[j - 1][i - 1].type];
                        }
                    }
                }
            }
            [color, rank, j, i, from, length, type] = searchСard.call(this, e.target.id);
            id = e.target.id;
            if (rank == 12 && i == length && from == 'arrOfCardsPlaces') {
                el = document.getElementById(id);
                el.style.marginTop = '0px';
                while (u) {
                    if (this.init.finishinDecks[u - 1].length == 0) {
                        document.getElementById('finishinDecks' + u).appendChild(el);
                        el.draggable = false;
                        this.init.finishinDecks[u - 1].push(this.init.arrOfCardsPlaces[j - 1][i - 1]);
                        this.init.arrOfCardsPlaces[j - 1].splice(i - 1);
                        if (this.init.arrOfCardsPlaces[j - 1][i - 2]) {
                            this.init.arrOfCardsPlaces[j - 1][i - 2].visible = true;
                            document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 2].cardId).src = "img/gifsOfCards/" + this.init.arrOfCardsPlaces[j - 1][i - 2].face;
                            document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 2].cardId).draggable = true;
                        }
                        u = 0;
                    }
                    else (u < 4) ? u += 1 : u = 0;
                }
            }
            else {
                if (rank == 12 && from == 'arrhandOutCards') {
                    el = document.getElementById(id);
                    el.style.marginTop = '0px';
                    el.style.marginLeft = '0px';
                    while (u) {
                        if (this.init.finishinDecks[u - 1].length == 0) {
                            document.getElementById('finishinDecks' + u).appendChild(el);
                            el.draggable = false;
                            this.init.finishinDecks[u - 1].push(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1]);
                            this.init.arrhandOutCards.splice(this.init.arrhandOutCards.length - 1);
                            if (this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1]) {
                                document.getElementById(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].cardId).draggable = true;
                            }
                            u = 0;
                        }
                        else (u < 4) ? u += 1 : u = 0;
                    }
                }
            }
            //Отправляем  двойку домой
            if (rank == 0 && i == length && from == 'arrOfCardsPlaces') {
                while (u) {
                    if (this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].rank == 12 &&
                        this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].type == type) {
                        el = document.getElementById(id);
                        el.style.marginTop = '0px';
                        document.getElementById('finishinDecks' + u).appendChild(el);
                        el.draggable = false;
                        this.init.finishinDecks[u - 1].push(this.init.arrOfCardsPlaces[j - 1][i - 1]);
                        this.init.arrOfCardsPlaces[j - 1].splice(i - 1);
                        if (this.init.arrOfCardsPlaces[j - 1][i - 2]) {
                            this.init.arrOfCardsPlaces[j - 1][i - 2].visible = true;
                            document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 2].cardId).src = "img/gifsOfCards/" + this.init.arrOfCardsPlaces[j - 1][i - 2].face;
                            document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 2].cardId).draggable = true;
                        }
                        u = 0;
                    }
                    else (u < 4) ? u += 1 : u = 0;
                }
            }
            else {
                if (rank == 0 && from == 'arrhandOutCards') {
                    while (u) {
                        if (this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].rank == 12 &&
                            this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].type == type) {
                            el = document.getElementById(id);
                            el.style.marginTop = '0px';
                            el.style.marginLeft = '0px';
                            document.getElementById('finishinDecks' + u).appendChild(el);
                            el.draggable = false;
                            this.init.finishinDecks[u - 1].push(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1]);
                            this.init.arrhandOutCards.splice(this.init.arrhandOutCards.length - 1);
                            document.getElementById(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].cardId).draggable = true;
                            u = 0;
                        }
                        else (u < 4) ? u += 1 : u = 0;
                    }
                }
            }

            //отправляем домой карты отличные от туза и двойки
            if (rank != 0 && rank != 12 && i == length && from == 'arrOfCardsPlaces') {
                u = 1;
                rank -= 1;
                while (u) {
                    if (this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].rank == rank &&
                        this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].type == type) {
                        el = document.getElementById(id);
                        el.style.marginTop = '0px';
                        document.getElementById('finishinDecks' + u).appendChild(el);
                        el.draggable = false;
                        this.init.finishinDecks[u - 1].push(this.init.arrOfCardsPlaces[j - 1][i - 1]);
                        this.init.arrOfCardsPlaces[j - 1].splice(i - 1);
                        if (this.init.arrOfCardsPlaces[j - 1][i - 2]) {
                            this.init.arrOfCardsPlaces[j - 1][i - 2].visible = true;
                            document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 2].cardId).src = "img/gifsOfCards/" + this.init.arrOfCardsPlaces[j - 1][i - 2].face;
                            document.getElementById(this.init.arrOfCardsPlaces[j - 1][i - 2].cardId).draggable = true;
                        }
                        u = 0;
                    }
                    else (u < 4) ? u += 1 : u = 0;
                }
            }
            else {
                u = 1;
                if (rank != 0 && rank != 12 && from == 'arrhandOutCards') {
                    rank -= 1;
                    while (u) {
                        if (this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1] && this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].rank == rank &&
                            this.init.finishinDecks[u - 1][this.init.finishinDecks[u - 1].length - 1].type == type) {
                            el = document.getElementById(id);
                            el.style.marginTop = '0px';
                            el.style.marginLeft = '0px';
                            document.getElementById('finishinDecks' + u).appendChild(el);
                            el.draggable = false;
                            this.init.finishinDecks[u - 1].push(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1]);
                            this.init.arrhandOutCards.splice(this.init.arrhandOutCards.length - 1);
                            if (this.init.arrhandOutCards.length) {
                                document.getElementById(this.init.arrhandOutCards[this.init.arrhandOutCards.length - 1].cardId).draggable = true;
                            }
                            u = 0;
                        }
                        else (u < 4) ? u += 1 : u = 0;
                    }
                }
            }
            if (this.init.finishinDecks[0].length == 13 && this.init.finishinDecks[1].length == 13 &&
                this.init.finishinDecks[2].length == 13 && this.init.finishinDecks[3].length == 13) {
                alert('Победа!');
            }
        }
    }

    new Game();

})();
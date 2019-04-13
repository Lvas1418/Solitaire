/*   I know that this code has a smell, but I also know that I can do better. 

    Ok. Lets look what could be better
    
    Again - you used classes to make your code structured and this is good
    but classes here has no meaning at all
    because they are just containers
    and you could use flat objects instead

    A lot of code spent to hande styles and UI
    Better knowledge of markup can save your time and efforts in js
*/

(function () {

    /*
        Don't use one letter namings
        even if you use these params just to reassing to named props

        Class without behaviour it is only data container
        You could delegate some work to this
    */
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

    /*
        var,let,const

        global variable at the moment

        all the code shares this structure.
        You should think more in component way and split responsibilities
    */
    init = {
        deck: [],
        deck2: [],
        arrhandOutCards: [],
        /*
            No reason to define empty matrix here, could be just []
            I can imagine that you use count of matrix rows as parameter
            for loop, but below you just use magic number '7' :)
        */
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
            /*
                Recall about referencing types

                when you work with this.init your 'init' object will be changed as well
                you can copy it using Object.assign but there is nested structures
                so you need deep cloning which is not a part of standart js tools
                and can be achieved by using custom-built copying functions
            */
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

            /*
                let el ... ;
                let el2 ... ;
                let margTop ... ;

                more readable

                el2 and margTop could be loop scope variables below
            */
            let el = document.createElement("img"), el2, margTop = 0;

            /*
                Why don't you make this function an instance method
                you use it 4 times and always with 'Game' context
            */
            function creatObj(color, type) {

                //Создаем экземпляры карт и помещаем их в массив (колоду)
                for (let i = 0; i <= 12; i++) {
                    this.init.deck.push(new Card(i, type, color, i + type + ".gif", i + type));

                    /*
                        Couldn't find out what deck2 is used for and why you double Card instances
                    */
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
                /*
                    No need to use concat here. Your array is empty
                    What the benefit of merging empty array with non-empty?

                    getting rid of concat will make this line less spaghetti
                */
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
                            /*
                                push.apply or push(...[])
                                look less spaghetti
                            */
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

        /*
            Tsar method :)
            A lot of nesting
            Overcomplicated

            same as method below

            Surprisingly but the code below works :)

            I don't wont to parse and comment further
            because of bad readability and a lot of spaghetti
            I will just summarize here

            - Game logic is entangled with UI work.

            - Too much nesting for
                                if
                                    if
                                        for
                                            if
                                                etc...

            - deep method/properties accessing obj.prop1.prop2.prop3 
                getting worse when some prop is array. Don't be lazy and put them into variables with good names.
                This approach works only while you are developing and keep these structures in mind

            - I guess here is a lot of code that is repeatable and could be moved to a separate method(s)
                All these loops looks like the same
        */
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
            
            /*
                Possibly could be instance method
            */
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
        
        /*
            I was wrong
            this is Tsar method :))
        */
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
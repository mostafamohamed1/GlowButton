'use strict';
class GlowingBox {
	// Box
	_elements;
	_distance;
	// Glow
	_spanEle;
	_spanDist;
	// Styling
	_styeElement;

	constructor(selector, { text, from, width, height }) {
		this.selector = selector;
		this.setting = {
			text: text || 'Glow Button',
			from: from || 100,
			widthBox: width || 150,
			heightBox: height || 50,
		};

		// Custom Styling in Style Attr
		this._styeElement = document.createElement('style');
		document.head.appendChild(this._styeElement);

		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		// Get all selectors BoxContainer
		this._elements = this._getSelector(this.selector);
		//Style BoxContainer Element
		this._styleBoxContainerElement(this._elements);

		// Get distanceContainer
		this._distance = this._getDistance(this._elements);
		// Execute glowing
		this._calcDistance(this._elements);

		// Creating elements for glowing hover
		this._createElements(this.setting.text);

		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		// Information SPAN

		// Get all Selector span
		this._spanEle = this._getSelector('.glow-span');
		// Style Span Element
		this._styeSpanElement(this._spanEle);
		// Get spanDist
		this._spanDist = this._getDistance(this._spanEle);

		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		// Information Button
		this._btnEle = this._getSelector('.glow-btn');
		//Style Button Element
		this._styleButtonElement(this._btnEle);

		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		// Information pseudo Button
		this._beforeButton(this._btnEle);
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		///////////////////////////////////////////////////
		// Reset viewport
		this._restViewport();
	}

	_getSelector(select) {
		return [...document.querySelectorAll(select)];
	}
	// Distance
	_getDistance(elements) {
		return elements.map((ele) => ele.getBoundingClientRect());
	}
	// Reset viewport
	_restViewport() {
		window.addEventListener('resize', () => {
			this._elements = this._getSelector(this.selector);
			this._distance = this._getDistance(this._elements);
			this._spanEle = this._getSelector('.glow-span');
			this._spanDist = this._getDistance(this._spanEle);
			console.log('resize');
		});
	}

	// Element in position
	_isNearFromElement(distance, clientY, clientX, index) {
		return (
			distance[index].top - this.setting.from <= clientY &&
			distance[index].left - this.setting.from <= clientX &&
			distance[index].bottom + this.setting.from >= clientY &&
			distance[index].right + this.setting.from >= clientX
		);
	}

	// Calc And Active Glow
	_calcDistance(elementsBox) {
		elementsBox.forEach((_, index) => {
			window.addEventListener('mousemove', (e) => {
				const clientX = e.clientX;
				const clientY = e.clientY;

				if (this._isNearFromElement(this._distance, clientY, clientX, index)) {
					this._spanEle[index].style.display = 'block';
					this._spanEle[index].style.left =
						clientX - this._distance[index].x + 'px';
					this._spanEle[index].style.top =
						clientY - this._distance[index].y + 'px';
					this._mouseHover(this._elements);
				} else {
					this._spanEle[index].style.display = 'none';
				}
			});
		});
	}

	// Function create element for glowing
	_createElements(text) {
		this._elements.forEach((el) =>
			el.insertAdjacentHTML(
				'afterbegin',
				`<button class="glow-btn">${text}</button>
        <span class="glow-span"></span>`
			)
		);
	}

	_randomNumber(number) {
		this.ranNumber = Math.ceil(Math.random() * number);
	}

	// Border Glow
	_mouseHover(buttons) {
		buttons.forEach((btn) => {
			btn.addEventListener('mouseenter', () => {
				btn.style.background = 'rgba(255, 255, 255, 0.9)';
				btn.style.BoxShadow = ' 0 5px 10px 20px rgba(255, 255, 255, 0.9)';
			});
			btn.addEventListener('mouseleave', () => {
				btn.style.background = '#333';
			});
		});
	}

	// Box style
	_styleBoxContainerElement(elements) {
		this.boxContainer = `
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      width: ${this.setting.widthBox}px;
      height: ${this.setting.heightBox}px;
      background-color: rgb(0,0,0);
      transition: all 0.3s ease-in-out;
      overflow: hidden;
      border-radius: 5px;
      box-shadow: 0 5px 30px 1px rgba(0,0,0,.3)
    `;

		elements.forEach((ele) => (ele.style.cssText = this.boxContainer));
	}

	// span style
	_styeSpanElement(elements) {
		this.span = `
    position: absolute;
    top: 0%;
    left: 0%;
    z-index: 0;
    
    width: 100px;
    height: 100px;

    border-radius: 50%;
    filter: blur(20px) brightness(400%);
    transform: translate(-50%, -50%);

    background: rgba(255, 255, 255);
    display: none;
    `;

		elements.forEach((ele) => (ele.style.cssText = this.span));
	}

	// button style
	_styleButtonElement(elements) {
		this.button = `
    position: relative;
    z-index: 1;

    width: ${this.setting.widthBox - 2}px;
    height: ${this.setting.heightBox - 2}px;

    border: none;
    outline: none;

    font-size: 17px;
    font-weight: 300;

    display: block;
    border-radius: 5px;

    background-color: rgb(21, 29, 33, 0.9);
    color: #fff;
    `;

		elements.forEach((ele) => (ele.style.cssText = this.button));
	}

	_beforeButton(element) {
		const roleBefore = `
      content: '';
      position: absolute;
      top: 0;
      left: 0;

      width: 100%;
      height: 100%;
      background-color: rgba(255,255,255, .5);
      opacity: .3;
      clip-path: circle(0% at 0% 100%);
      transition: all .2s ease-in-out;
    `;

		//filter: blur(10px);

		const roleHover = `
    clip-path: circle(100%);
    `;
		//0% at 0% 100%

		element.forEach((ele, i) => {
			console.log(ele.className);
			document.styleSheets[0].addRule(
				`.${String(ele.className) + ':before'}`,
				roleBefore
			);
		});

		element.forEach((ele) => {
			console.log(ele.className);
			document.styleSheets[0].addRule(
				`.${String(ele.className) + ':hover:before'}`,
				roleHover
			);
		});
	}

	static init(s, i) {
		return new GlowingBox(s, i);
	}
}

GlowingBox.init('.glow-box', {
	text: 'Mostafa',
	from: 30,
	widthBox: 70,
	height: 40,
});

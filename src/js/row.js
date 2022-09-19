import { PreviewItem } from './previewItem';

/**
 * Class representing a Row (.row)
 */
 export class Row {
    // DOM elements
	DOM = {
		// main element (.row)
		el: null,
        // title (.cell__title > .oh__inner)
        title: null,
        // title wrap
        titleWrap: null,
        // images wrap
        imagesWrap: null,
        // images (.cell__img)
        images: null
	}
    
    /**
	 * Constructor.
	 * @param {Element} DOM_el - main element (.row)
	 */
	constructor(DOM_el, DOM_previewItem) {
		this.DOM.el = DOM_el;
        this.previewItem = new PreviewItem(DOM_previewItem);
        this.DOM.titleWrap = this.DOM.el.querySelector('.cell__title');
        this.DOM.title = this.DOM.titleWrap.querySelector('.oh__inner');
        this.DOM.imagesWrap = this.DOM.el.querySelector('.cell--images');
        this.DOM.images = [...this.DOM.imagesWrap.querySelectorAll('.cell__img')];
	}
}
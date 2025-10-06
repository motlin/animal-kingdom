import {describe, it, expect, beforeEach} from 'vitest';
import {getElement, querySelector, querySelectorAll} from './dom.ts';

describe('DOM utilities', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	describe('getElement', () => {
		it('returns element when it exists', () => {
			document.body.innerHTML = '<div id="test-element">Hello</div>';
			const element = getElement('test-element');
			expect(element.textContent).toBe('Hello');
		});

		it('throws error when element does not exist', () => {
			expect(() => getElement('nonexistent')).toThrow('Element with id "nonexistent" not found');
		});
	});

	describe('querySelector', () => {
		it('returns element when it exists', () => {
			document.body.innerHTML = '<div class="test-class">World</div>';
			const element = querySelector('.test-class');
			expect(element.textContent).toBe('World');
		});

		it('throws error when element does not exist', () => {
			expect(() => querySelector('.nonexistent')).toThrow('Element with selector ".nonexistent" not found');
		});
	});

	describe('querySelectorAll', () => {
		it('returns empty NodeList when no elements exist', () => {
			const elements = querySelectorAll('.nonexistent');
			expect(elements.length).toBe(0);
		});

		it('returns all matching elements', () => {
			document.body.innerHTML = `
        <div class="item">One</div>
        <div class="item">Two</div>
        <div class="item">Three</div>
      `;
			const elements = querySelectorAll('.item');
			expect(elements.length).toBe(3);
		});
	});
});

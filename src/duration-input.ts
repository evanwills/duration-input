import { html, css, LitElement, } from 'lit';
// import { repeat } from 'lit/directives/repeat';
import { customElement, property, state } from 'lit/decorators.js';
import { Iunit } from './vite-env';

@customElement('duration-input')
export class DurationInput extends LitElement {
  /**
   * Number of seconds the duration represents
   *
   * @var value
   */
  @property({ reflect: true, type: Number })
  value : number = 0;

  /**
   * Minumum number of seconds the duration can represent
   *
   * @var min
   */
  @property({ type: Number })
  min : number = 0; // 0 seconds

  /**
   * Maximum number of seconds the duration can represents
   *
   * @var max
   */
  @property({ type: Number })
  max : number = 157788000; // 5 years

  /**
   * String to use as the button labels
   *
   * @var label
   */
  @property({ type: String })
  label : string = 'set';

  /**
   * Whether or not to hide the input button
   *
   * If TRUE, changes to both human value input and unit select will
   * trigger change events to be triggered by the root components.
   *
   * @var noBtn
   */
  @property({ type: Boolean })
  noBtn : boolean = false;

  static styles = css`
    :root {
      --wc-border-radius: var(--border-radius, 0.75rem);
      --wc-text-colour: var(--txt-colour, rgb(255, 255, 255));
      --wc-bg-colour: var(--bg-colour, rgb(0, 85, 34));
      --wc-error-bg-colour: var(--error-bg-colour, rgb(150, 0, 0));
      --wc-error-text-colour: var(--error-txt-colour, rgb(255, 255, 255));
      --wc-line-width: var(--border-thickness, 0.075rem);
      --wc-max-width: var(--max-regex-width, 30rem);
      --wc-default-input-font: 'Courier New', Courier, monospace;
      --wc-input-font: var(--input-font-family, var(--wc-default-input-font));
      --wc-outline-width: var(--outline-thickness, 0.25rem);
      --wc-outline-style: var(--outline-style, dotted);
      --wc-outline-offset: var(--outline-offset, 0.2rem);

      background-color: var(--wc-bg-colour, inherit);
      color:  var(--wc-text-colour, inherit);
      font-family: inherit;
      font-size: inherit;
    }
    .sr-only {
      border: 0;
      clip: rect(0, 0, 0, 0);
      clip-path: inset(100%);
      height: 1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
    .inputs {
      background-color: var(--wc-bg-colour, #000);
      border: 0.05rem solid var(--wc-text-colour);
      border-radius: var(--wc-border-radius);
      overflow: hidden;
    }
    input {
      background-color: transparent;
      border: none;
      color: var(--wc-text-colour, #fff);
      display-inline-block;
      font-family: 'Courier New', Courier, monospace;
      font-size: 0.875rem;
      font-weight: bold;
      padding-left: 0.5rem;
      padding-right: 0;
      transform: translateY(-0.09rem);
      text-align: right;
      width: 6rem;
      display: inline-block;
    }
    select {
      background-color: transparent;
      border: none;
      color: var(--wc-text-colour, #fff);
      padding-left: 0.2rem;
    }
    option {
      background-color: var(--text-colour);
      color: var(--bg-colour);
    }
    option::selection {
      background-color: var(--bg-colour);
      color: var(--text-colour);
    }
    button {
      border-radius: var(--wc-border-radius);
      border: 0.05rem solid var(--wc-btn-colour);
      padding: 0.1rem var(--wc-border-radius);
      background-color: var(--wc-btn-bg-colour, #2d2b2b);;
      color: var(--wc-btn-colour, #fff);
      /* font-weight: bold; */
      text-transform: uppercase;
    }
  `;

  /**
   * List of duration unit names & values
   *
   * @var units
   */
  @state()
  private _units : Array<Iunit> = [
    { key: 'year', value: 31557600 }, // 365.25 days
    { key: 'month', value: 2629800 }, // 365.25 days / 12 months
    { key: 'week', value: 604800 }, // 7 days
    { key: 'day', value: 86400 }, // 24 hours
    { key: 'hour', value: 3600 }, // 60^2
    { key: 'minute', value: 60 },
    { key: 'second', value: 1 }
  ];

  /**
   * The calculated human friendly representation of the duration
   *
   * @var _humanValue
   */
  @state()
  public _humanValue : number = 0;

  /**
   * The string to label the units applied to the human friendly
   * representation of the duration
   *
   * @var _unitStr
   */
  @state()
  public _unitStr : string = 'seconds';

  /**
   * The number of seconds the unit represents
   *
   * @var _unitVal
   */
  @state()
  public _unitVal : number = 1;

  /**
   * Get plural "S" if appropriate for number
   *
   * @param input Number which determines plural or not
   *
   * @returns 's' if number should be a plural or
   *          '' (empty string) if not
   */
  _s (input : number) : string {
    return (input !== 1) ? 's' : ''
  }

  /**
   * Make the first characer in a string UPPER CASE
   *
   * @param input String to modified
   *
   * @returns modified string
   */
  _ucfirst(input : string) : string {
    return input.substring(0, 1).toUpperCase() + input.substring(1)
  }

  /**
   * Set the current working human value, unit string and unit value
   * for the supplied value
   */
  _setUnitValue () : void {
    for (let a = 0; a < this._units.length; a += 1) {
      if (this.value >= this._units[a].value) {
        // TODO: work out if value can be more cleanly represented by
        //       a larger integer for a smaller unit
        this._humanValue = Math.round((this.value / this._units[a].value) * 1000) / 1000;
        this._unitStr = this._units[a].key
        this._unitVal = this._units[a].value
        break;
      }
    }
  }

  /**
   * Check whether something is an integer
   *
   * @param {any} input Value that should be numeric
   *
   * @returns {boolean} `TRUE` if the input is an integer
   *                    `FALSE` otherwise
   */
  _isInt (input : any) : boolean {
    return !isNaN(parseInt(input));
  }

  /**
   * Do save action if button is hidden
   */
  _change () : void {
    if (this.noBtn) {
      this.saveChange(new Event('change'));
    }
  }

  /**
   * Event handler for duration unit select field change
   *
   * @param event Event object triggered by human interaction
   */
  unitChange(event: Event) : void {
    event.preventDefault()
    const input = event.target as HTMLInputElement;

    for (let a = 0; a < this._units.length; a += 1) {
      if (parseFloat(input.value) == this._units[a].value) {
        this._unitStr = this._units[a].key;
        this._unitVal = this._units[a].value;

        this._change();

        break;
      }
    }
  }

  /**
   * Event handler for duration value input field change
   *
   * @param event Event object triggered by human interaction
   */
  valueChange (event: Event) : void {
    event.preventDefault()
    const input = event.target as HTMLInputElement;
    this._humanValue = parseFloat(input.value);

    this._change();
  }

  /**
   * Event handler for duration value input field change
   *
   * @param event Event object triggered by human interaction
   */
  saveChange (event: Event) {
    event.preventDefault()
    let seconds = Math.round(this._humanValue * this._unitVal);
    let modified = false;
    if (seconds < this.min) {
      seconds = this.min;
      modified = true;
    } else if (seconds > this.max) {
      seconds = this.max
      modified = true;
    }

    if (seconds !== this.value) {
      this.value = seconds;

      if (modified) {
        this._setUnitValue();
        this.requestUpdate();
      }

      this.dispatchEvent(
        new Event( 'change', {bubbles: true, composed: true})
      );
    }
  }

  render() {
    this._setUnitValue();
    const s = this._s(this._humanValue);

    return html`
      <span class="inputs">
        <label for="duration-value" class="sr-only">Duration value</label><!--
        --><input id="duration-value" type="number" .value="${this._humanValue}" min="${this.min}" max="${this.max}" step="0.001" @change=${this.valueChange} /><!--

        --><label for="duration-unit" class="sr-only">Duration unit</label><!--
        --><select id="duration-unit" .value="${this._unitVal}" @change=${this.unitChange}>
          ${this._units.map(item => html`
            <option .value="${item.value}" ?selected="${(item.key === this._unitStr)}">
              ${this._ucfirst(item.key)}${s}
            </option>`
          )}
        </select>
      </span>

      ${(!this.noBtn)
        ? html`<button @click=${this.saveChange}>${this.label}</button>`
        : ''
      }

    `;
  }
}

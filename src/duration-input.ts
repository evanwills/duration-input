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
    :host {
      --wc-error-bg-color: #000;
      --wc-error-border-color: transparent;
      --wc-error-border-width: 0;
      --wc-error-border-radius: 0.75rem;
      --wc-error-color: #fff;
      --wc-error-padding: 1rem;

      --wc-outline-color: #fff;
      --wc-outline-offset: 0.2rem;
      --wc-outline-style: dotted;
      --wc-outline-width: 0.25rem;

      --wc-btn-bg-color: rgb(0, 85, 34);
      --wc-btn-border-color: transparent;
      --wc-btn-border-width: 0;
      --wc-btn-border-radius: 0.75rem;
      --wc-btn-color: #fff;
      --wc-btn-font-family: inherit;
      --wc-btn-font-size: inherit;
      --wc-btn-padding: 0.2rem 0.75rem;

      --wc-input-bg-color: #000;
      --wc-input-border-color: #fff;
      --wc-input-border-style: solid;
      --wc-input-border-width: 0.075rem;
      --wc-input-border-radius: 0.75rem;
      --wc-input-color: #fff;
      --wc-input-font-family: 'Courier New', Courier, monospace;
      --wc-input-font-size: 1rem;
      --wc-input-padding-top: 0.1rem;
      --wc-input-padding-right: 0.5rem;
      --wc-input-padding-bottom: 0.1rem;
      --wc-input-padding-left: 0.5rem;
      --wc-input-width: 6rem;

      background-color: inherit
      color: inherit
      font-family: inherit
      font-size: inherit
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
    .wrap {
      background-color: var(--wc-input-bg-color);
      border: 0.05rem solid var(--wc-input-border-color);
      border-radius: var(--wc-input-border-radius);
      overflow: hidden;
      padding: var(--wc-input-padding-top)
               var(--wc-input-padding-right)
               var(--wc-input-padding-bottom)
               var(--wc-input-padding-left);
    }
    input {
      background-color: transparent;
      border: none;
      color: var(--wc-input-color);
      display-inline-block;
      font-family: var(--wc-input-font-family);
      font-size: var(--wc-input-font-size);
      font-weight: bold;
      padding-left: 0.5rem;
      padding-right: 0;
      transform: translateY(-0.07rem);
      text-align: right;
      width: var(--wc-input-width: 6rem);
      display: inline-block;
    }
    select {
      background-color: transparent;
      border: none;
      color: var(--wc-input-color);
      font-family: var(--wc-input-font-family);
      font-size: var(--wc-input-font-size);
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
      display: inline-block;
      background-color: var(--wc-btn-bg-color, #2d2b2b);;
      border-radius: var(--wc-btn-border-radius);
      border-color: var(--wc-btn-border-color);
      border-style: 0.05rem solid var(--wc-btn-border-style);
      border-width: 0.05rem solid var(--wc-btn-border-width);
      color: var(--wc-btn-colour, #fff);
      margin-left: 0.5rem;
      padding: var(--wc-btn-padding);
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
    const c = this._units.length
    let unit : Iunit|null = null

    // Lets see if we can get a nice round unit value
    for (let a = 0; a < c; a += 1) {
      if ((this.value % this._units[a].value) === 0) {
        // Great this unit devides evenly into our value
        // We'll use this one
        unit = this._units[a]
        break;
      }
    }

    if (unit === null) {
      // Bummer we going to have to go with best fit

      for (let a = 0; a < c; a += 1) {
        if (this.value >= this._units[a].value) {
          // This unit is as good as we're going to get
          unit = this._units[a]
          break;
        }
      }
    }

    if (unit !== null) {
      this._humanValue = Math.round((this.value / unit.value) * 1000) / 1000;
      this._unitStr = unit.key
      this._unitVal = unit.value
    } else {
      throw Error('unit is NULL. This should never happen!!!')
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
      <span class="wrap">
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

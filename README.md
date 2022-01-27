# `<duration-input>`

`<durations-input>` is a web component that allows users to enter a
duration in a human friendly way but with the output being seconds.

> __NOTE:__ Because `<durations-input>` uses two fields to represent
>           a single value a change to one may not represent the
>           final value the user wants.
>
> To get around this the `<durations-input>` component uses a "set"
> button to allow the user to tell the client when they are ready.
> This may not be desirable in some use cases. To remove the "set"
> button, just include the `nobtn`

-----

## Attriubtes

To allow for enough flexibility, this component has four attributes.

```html
<!-- duration: 1 week -->
<duration-input value="604800"></regex-input>
```

### `value` *{number}*

__Default:__ `0`

The total number of seconds a duration is set to represent

### `min` *{number}*

__Default:__ `0`

The minumum number of seconds a duration can represent

```html
<!--
 ! duration: 1 week
 ! minumum: 1 hour
 ! -->
<duration-input value="604800" min="3600"></regex-input>
```

### `max` *{number}*

__Default:__ `157788000` *(1 year)*

The maximum number of seconds a duration can represent

```html
<!--
 ! duration: 1 week
 ! minumum: 1 day,
 ! maximum: 6 months
 ! -->
<duration-input value="604800" min="86400" max="15778800">
</regex-input>
```

### `label` *{string}*

__Default:__ `set`

String to use as the button label

```html
<!-- duration: 1 week -->
<duration-input value="604800" label="update"></regex-input>
```

### `nobtn` *{boolean}*

__Default:__ `FALSE`

Whether or not to hide the "set" button.

> __NOTE:__ If `TRUE`, changes to both the human value and the unit
>           select will trigger change events outside the component.

```html
<!-- duration: 1 week -->
<duration-input value="604800" nobtn></regex-input>
```

-----

## Styling

To help make `<duration-input>` easier to integrate into applications
there are a number of css custom properties that allow the client
application to define various style properties.

> __NOTE:__ I may have got the behavior of setting values from
>           outside the component wrong so let me know if you
>           encounter any issues.

### CSS custom properties:

* `--wc-font-size` - *(Default: `1rem`)*
* `--wc-border-radius` - *(Default: `0.75rem`)* -
  Used for buttons, error message box and patter/flag input wrapper
* `--wc-text-colour` - *(Default: `rgb(255, 255, 255)`)*
* `--wc-bg-colour` - *(Default: `rgb(0, 85, 34)`)*;
* `--wc-error-bg-colour` - *(Default: `rgb(150, 0, 0)`)* -
  Background colour for regular expression errors
* `--wc-error-text-colour` - *(Default: `rgb(255, 255, 255)`)* -
  Text colour for regular expression errors
* `--wc-line-width` - *(Default: `0.075rem`)* -
  Border thickness;
* `--wc-max-width` - *(Default: `30rem`)* -
  Maximum with of pattern input field;
* `--wc-default-input-font` - *(Default: `'Courier New', Courier, monospace`)*
* `--wc-input-font` - *(Default: `'Courier New', Courier, monospace`)* -
  Font family used for input fields

#### Accessibility - outline styles

Styling to identify an input field is in focus

* `--wc-outline-width` - *(Default: `0.25rem`)* -
  Width of the field outline
* `--wc-outline-style` - *(Default: `dotted`)*; -
  Line style for outline
* `--wc-outline-offset` - *(Default: `0.2rem`)* -
  Space around the field (between the outline and the field)
# React Select2

This component is a wrapper for select2, although there is a package called `react-select2`, I think it is not behaviour like a react component.
So I build this component for those who lik react.

## Usage

```
import { Select2 } from "./react-select2.jsx"

render() {
    let items = [
        {
            text: "item1",
            value: 1,
            disabled: true
        },
        {
            text: "item2",
            value: 2
        }
    ];
  return <Select2 items={items} width={200} />;
}
```

## Props

**items**

Array.

The dropdown list.

```
{
    text: "option text",
    value: "option value",
    disabled: true|false|undefined
}
```

Original select need you to pass objects who have `id` property, but here, to match `option` tag, I force you to contains a `value` property.

`disable` property make this option item has `disabled` attribute.

**width**

Width to set to the box. You can use number and string. i.e. 500, 200px, 60%...

**disabled**

Make it disabled.

**defulatValue**

Which option to be selected.

As you known, `defaultValue` in React means this is a uncontrolled component, you can NOT change the value by code.

**value & onSelect**

Which option to be selected and change by code.

```
<Select2 items={this.state.items} value={this.state.value} onSelect={(e) => {
    let value = e.params.data.id; // follow select2 params rules
    this.setState({ value });
}} />
```

As you known, `value` in React means this is a controlled component, you can ONLY change the value by code. 
So `value` is always appears with `onSelect`.

**placeholder**

String. To show before you select a item.

## Events Props

We use Select2 to implement the dropdown effects, so you should have to know how to use select2 events first.
Click the link https://select2.org/programmatic-control/events to learn some official examples.

**onOpen**

Be called when dropdown list open.

**onSelect**

Be called when you select a item in the dropdown list.

**onClose**

Be called when you click outside the box and the dropdown disappears.

**onUnselect**

I don't know what it do...

```
<Select2 items={...} width={200} onOpen={e => console.log(e)} onSelect={...} onClose={...} />
```

**onSearch**

This is not select2 original event.

When you pass onSearch, it means you want to search data from backend to put the list in combo-box dropdown list.

`onSearch` should be a function which return a promise. It has two parameters, `searchText` and `lastResults`:

```
function onSearch(searchText, lastResults) {
    // the fist time dropdown list open, there is no search text, or you delete all text.
    // You can choose what to return, a default list or a warn message.
    // this should must be dealed with by yourself.
    if (!searchText) {
        return Promise.resolve(lastResults || this.state.items);
    }
    return $.get("/api/combo-box-items?keywords=" + searchText);
}
```

It should return a promise, which contains items in `resolve`. The item structure is the same as before mentioned.

```
<Select2 items={[]} width={200} onSearch={onSearch} placeholder="type to search" onSelect={...} />
```

Here, I pass items as [], because items is required. In this case, you may always keep this instance to be a uncontrolled instance.

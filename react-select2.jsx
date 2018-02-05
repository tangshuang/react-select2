import React, { Component } from "react";
import $ from "jquery";
import "select2/dist/js/select2.full.js";
import { isEqual, assign } from "lodash";

export default class Select2 extends Component {
    constructor(props) {
        super(props);
        this._keep = this._keep.bind(this);
        this._searchCache = null;
    }
    set(value) {
        let $el = $(this.el);
        $el.val(value);
        $el.trigger("change.select2");
    }
    get() {
        return $(this.el).val();
    }
    init(props) {
        let { placeholder, className, onSearch } = props;
        let themes = ["default react-select2"];
        let $el = $(this.el);

        themes.push(className);

        let options = {
            theme: themes.join(" "),
            containerCssClass: "react-select2__container",
            dropdownCssClass: "react-select2__dropdown",
            placeholder
        };

        if (onSearch) {
            options.ajax = {
                delay: 250,
                processResults: (data) => ({
                    results: data.map((item) => ({ text: item.text, id: item.value, disabled: item.disabled }))
                }),
                transport: (params, success, failure) => {
                    let query = params.data.q;
                    return onSearch(query, this._searchCache)
                        .then((data) => {
                            this._searchCache = data;
                            success(data);
                        })
                        .catch(failure);
                }
            };
        }

        $el.select2(options);
    }
    componentDidMount() {
        this.init(this.props);

        let $el = $(this.el);
        let select2 = $el.data("select2");

        $el.on("select2:select", this._keep);

        $el.on("select2:open", this.props.onOpen);
        $el.on("select2:select", this.props.onSelect);
        $el.on("select2:close", this.props.onClose);
        $el.on("select2:unselect", this.props.onUnselect);

        // clear previous search results, only show 'Searching...'
        select2.on("query", () => {
            let firstItem = select2.$results.find("li:first");
            // the fist time when you open dropdown list, it should show the last search cache,
            // when you typing, only 'Searching...' will be shown, the items will be hidden.
            if (firstItem.hasClass("loading-results")) {
                select2.$results.find("li").hide();
                select2.$results.find("li:first").show();
            } else {
                select2.$results.find("li").show();
            }
        });
    }
    _keep() {
        let { value } = this.props;
        if (typeof value !== "undefined") {
            if (value !== this.get()) {
                this.set(value);
            }
        }
    }
    componentWillUnmount() {
        $(this.el).select2("destroy");
    }
    componentDidUpdate(prevProps) {
        let prevItems = prevProps.items;
        let nextItems = this.props.items;
        let $el = $(this.el);

        // update select list
        if (!isEqual(prevItems, nextItems)) {
            this.init(this.props);
        }

        let prevValue = prevProps.value;
        let nextValue = this.props.value;
        if (typeof nextValue !== "undefined" && prevValue !== nextValue) {
            this.set(nextValue);
        }

        if ($el.data("select2").isOpen()) {
            $el.select2("open");
        }
    }
    render() {
        let {
            items,
            className,
            disabled,
            width,
            style,
            value,
            placeholder,
            onOpen,
            onSearch,
            onClose,
            onSelect,
            onUnselect,
            ...props
        } = this.props;
        let classNames = [];

        if (disabled) {
            classNames.push("react-select2--disabled");
        }

        if (width) {
            style = style ? assign({}, style, { width }) : { width };
        }

        if (placeholder) {
            items = [{ text: "", value: "", _placeholder: true }].concat(items);
        }

        if (typeof value !== "undefined") {
            return (
                <select
                    className={classNames.join(" ")}
                    disabled={disabled}
                    value={value}
                    readOnly
                    style={style}
                    {...props}
                    ref={(el) => (this.el = el)}
                >
                    {items.map((item) => (
                        <option key={item.value} value={item.value} disabled={item.disabled}>
                            {item.text}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <select className={classNames.join(" ")} disabled={disabled} style={style} {...props} ref={(el) => (this.el = el)}>
                {items.map((item) => (
                    <option key={item.value} value={item.value} disabled={item.disabled}>
                        {item.text}
                    </option>
                ))}
            </select>
        );
    }
}

import React, { Component } from 'react';

import './MenuSearch.css';

export default class MenuSearch extends Component {
    state = {
        titleQuery: '',
        linkQuery: '',
        showResults: false,
        results: []
    };

    static defaultProps = {
        menu: ''
    };

    search = {
        value: null
    };

    static removeDuplicates(arr){
        return arr.filter(function(elem, index, self) {
            return index === self.indexOf(elem);
        });
    }

    static createLinkRegex(query) {
        return new RegExp(
            '\\[.*\\]\\(.*(' + query + ').*\\)',
            "gi"
        );
    }
    static createTitleRegex(query) {
        return new RegExp(
            '\\[.*(' + query + ').*\\]\\(.*\\)',
            "gi"
        );
    }

    static escapeRegex(s) {
        return s.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    searchInMenu() {
        const menu = this.props.menu;

        const titleArray = menu.match(MenuSearch.createTitleRegex(this.state.titleQuery));
        const linkArray = menu.match(MenuSearch.createLinkRegex(this.state.linkQuery));

        const titleRegex = /\[(.*?)\]/;
        const linkRegex = /\]\((.*?)\)/;

        let resultsArray = [];
        let finalArray = [];
        let valueObject = {};
        let blockRegex;

        if (linkArray !== null && titleArray !== null)
            resultsArray = MenuSearch.removeDuplicates(titleArray.concat(linkArray));
        else if (titleArray === null && linkArray !== null)
            resultsArray = linkArray;
        else if (linkArray === null && titleArray !== null)
            resultsArray = titleArray;

        if(resultsArray.length > 0) {
            resultsArray.forEach(function (value) {
                blockRegex = new RegExp(
                    '<details><summary>(.*?)<\\/summary>[^<]*?' + MenuSearch.escapeRegex(value),
                    ''
                );

                valueObject = {
                    "title": value.match(titleRegex)[1],
                    "link": value.match(linkRegex)[1],
                    "parent": (menu.match(blockRegex)) ? menu.match(blockRegex)[1] : null
                };
                finalArray.push(valueObject);
            });
        }

        this.setState({
            showResults: true,
            results: finalArray
        });
    }

    cleanResults = () => {
        this.setState({
            showResults: false,
            results: ''
        });
    };

    handleInputChange = () => {
        this.setState({
            titleQuery: this.search.value,
            linkQuery: this.search.value.replace(" ", "-")
        }, () => {
            if(this.search.value !== null && this.search.value.length > 2)
                this.searchInMenu();
            else
                this.cleanResults();
        });
    };

    preventBlur = (e) => {
        e.preventDefault();
    };

    handleClearButton = () => {
        this.search.value = '';
        this.handleInputChange();
        this.search.focus();
    };

    handleSearchResultClick = (event) => {
        window.navigateTo(event, event.currentTarget.getAttribute('href'));
        this.cleanResults();
        this.search.blur();
    };

    render() {
        return (
            <form id="menuSearch"
                  onFocus={this.handleInputChange}
                  onSubmit={(event) => event.preventDefault()}
            >
                <input
                    placeholder="Search in menu..."
                    ref={input => this.search = input}
                    onChange={this.handleInputChange}
                    onBlur={this.cleanResults}
                />
                {(this.search.value && <span id="menuSearchClear" onClick={this.handleClearButton}>+</span>)}
                {(this.state.showResults && <div id="menuSearchResults" onMouseDown={this.preventBlur}>{
                    (this.state.results.length > 0) ? this.state.results.map((result, i) =>
                        <a
                            href={result.link}
                            onClick={this.handleSearchResultClick}
                            key={i}
                        >
                            {(result.parent && <span>{result.parent} &raquo; </span>)}
                            {result.title}
                        </a>
                    ) : <div id="menuSearchNoResults"><p>No results :-(</p></div>
                }</div>)}
            </form>
        )
    }
}
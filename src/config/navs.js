export const regularNav = {
  "title": "Light navbar",
  thumb: '/images/components/sections/light-nav.jpg',
  "dragProps": {
    "rawWidth": 500,
    "rawHeight": 100,
    "width": "100%",
    "height": "100px"
  },
  "type": "div",
  "tagName": "div",
  "className": "navbar navbar-expand-lg navbar-light bg-light",
  "bootstrapClass": "navbar navbar-expand-lg navbar-light bg-light",
  "style": {
    "height": "fit-content"
  },
  "children": [
    {
      "type": "link",
      "tagName": "a",
      "content": "Mybrand.co",
      "href": "#",
      "thumb": "/images/text/body.svg",
      "style": {},
      "className": "navbar-brand",
      "bootstrapClass": "navbar-brand"
    },
    {
      "type": "div",
      "tagName": "div",
      "className": "navbar-toggler",
      "bootstrapClass": "navbar-toggler",
      "style": {
        "width": "auto"
      },
      "children": [
        {
          "type": "text",
          "tagName": "span",
          "content": "",
          "style": {},
          "className": "navbar-toggler-icon",
          "bootstrapClass": "navbar-toggler-icon"
        }
      ]
    },
    {
      "type": "div",
      "tagName": "div",
      "className": "collapse navbar-collapse",
      "bootstrapClass": "collapse navbar-collapse",
      domId: "navbarSupportedContent",
      "style": {},
      "children": [
        {
          "type": "list",
          "tagName": "ul",
          "className": "navbar-nav ml-auto",
          "bootstrapClass": "navbar-nav ml-auto",
          "style": {},
          "children": [
            {
              "type": "listItem",
              "tagName": "li",
              "content": "Item #1",
              "className": "nav-item",
              "bootstrapClass": "nav-item",
              "style": {},
              "children": [
                {
                  "type": "link",
                  "tagName": "a",
                  "content": "Link #1",
                  "className": "nav-link",
                  "href": "#",
                  "style": {
                    "color": "var(--main)"
                  }
                }
              ]
            },
            {
              "type": "listItem",
              "tagName": "li",
              "content": "Item #2",
              "className": "nav-item",
              "bootstrapClass": "nav-item",
              "style": {},
              "children": [
                {
                  "type": "link",
                  "tagName": "a",
                  "content": "Link #2",
                  "className": "nav-link",
                  "href": "#",
                  "style": {
                    "color": "var(--main)"
                  }
                }
              ]
            },
            {
              "type": "listItem",
              "tagName": "li",
              "content": "Item #3",
              "className": "nav-item",
              "bootstrapClass": "nav-item",
              "style": {},
              "children": [
                {
                  "type": "link",
                  "tagName": "a",
                  "content": "Link #3",
                  "className": "nav-link",
                  "href": "#",
                  "style": {
                    "color": "var(--main)"
                  }
                }
              ]
            },
            {
              "type": "listItem",
              "tagName": "li",
              "content": "Link #4",
              "className": "nav-item",
              "bootstrapClass": "nav-item",
              "style": {},
              "children": [
                {
                  "type": "link",
                  "tagName": "a",
                  "content": "Link #4",
                  "className": "nav-link",
                  "href": "#",
                  "style": {
                    "color": "var(--main)"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
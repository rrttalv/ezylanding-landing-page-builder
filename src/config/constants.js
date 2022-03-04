import { cardSection, singleCard } from "./cards"
import { features1, features2, flexRow2Col, largeColumn } from "./sections"

const div = {
  title: 'Empty div',
  thumb: '/images/sections/flex-row-2.svg',
  dragProps: {
    rawWidth: 500,
    rawHeight: 300,
    width: '50%',
    height: '300px'
  },
  type: 'div',
  tagName: 'div',
  className: '',
  inlineStyles: true,
  style: {
    minHeight: '100px'
  },
  children: []
}

const section = {
  title: 'Empty section',
  thumb: '/images/sections/flex-row-2.svg',
  dragProps: {
    rawWidth: 500,
    rawHeight: 300,
    width: '50%',
    height: '300px'
  },
  type: 'section',
  tagName: 'section',
  className: '',
  inlineStyles: true,
  style: {
    minHeight: '100px'
  },
  children: []
}

const span = {
  title: 'Span element',
  type: 'text',
  tagName: 'span',
  content: 'Span element',
  thumb: '/images/text/body.svg',
  dragProps: {
    rawWidth: 300,
    rawHeight: 25,
  },
  displayStyle: {
    wrapper: {
      width: '100%',
      height: '30px',
      marginBottom: '40px'
    },
    image: {
      height: '20px'
    }
  },
  style: {}
}

const label = {
  title: 'Label element',
  type: 'text',
  tagName: 'label',
  content: 'Label element',
  thumb: '/images/text/body.svg',
  dragProps: {
    rawWidth: 300,
    rawHeight: 25,
  },
  displayStyle: {
    wrapper: {
      width: '100%',
      height: '30px',
      marginBottom: '40px'
    },
    image: {
      height: '20px'
    }
  },
  style: {}
}

const p = {
  title: 'Paragraph element',
  type: 'text',
  tagName: 'p',
  content: 'Paragraph element',
  thumb: '/images/text/body.svg',
  dragProps: {
    rawWidth: 300,
    rawHeight: 25,
  },
  displayStyle: {
    wrapper: {
      width: '100%',
      height: '30px',
      marginBottom: '40px'
    },
    image: {
      height: '20px'
    }
  },
  style: {}
}

const textInput = {
  title: 'Text input',
  type: 'input',
  inputType: 'text',
  tagName: 'input',
  className: 'form-control',
  bootstrapClass: 'form-control',
  thumb: '/images/inputs/regular-btn.svg',
  placeholder: 'Write something here...',
  dragProps: {
    rawWidth: 200,
    rawHeight: 50,
  },
  style: {}
}

const textarea = {
  title: 'Textarea',
  type: 'textarea',
  tagName: 'textarea',
  className: 'form-control',
  bootstrapClass: 'form-control',
  thumb: '/images/inputs/regular-btn.svg',
  placeholder: 'Write something here...',
  dragProps: {
    rawWidth: 200,
    rawHeight: 100,
  },
  style: {}
}


const constants = {
  headers: {
    id: 'headers',
    title: 'Headers',
    elements: [
      {
        title: '2 Part Fixed header',
        type: 'header',
        partitions: 2,
        partitionStyles: {
          1: {
            display: 'flex',
            'flex-direction': 'row',
            width: '50%',
            'align-items': 'flex-end'
          },
          2: {
            display: 'flex',
            'flex-direction': 'row',
            width: '50%',
            'align-items': 'flex-start'
          }
        },
        style: {
          height: '50px',
          padding: '5px 20px',
          width: '100%',
          display: 'fixed',
          top: 0,
          left: 0,
          background: '#000000',
          'border-bottom': '1px solid rgba(0,0,0,0.1)'
        }
      }
    ]
  },
  sections: 
  {
    id: 'sections',
    title: 'Sections',
    elements: [
      {...flexRow2Col},
      {...largeColumn},
      {...features1},
      {...features2},
      div,
      section
    ]
  },
  inputs: {
    id: 'inputs',
    title: 'Inputs',
    elements: [
      {
        title: 'Rounded button',
        type: 'button',
        domID: '',
        dragProps: {
          rawWidth: 100,
          rawHeight: 30,
          width: '100px',
          height: '30px'
        },
        className: 'btn btn-main',
        tagName: 'button',
        content: 'Click me!',
        thumb: '/images/inputs/regular-btn.svg',
        style: {
          display: 'block',
          background: 'var(--main)',
          color: `var(--white)`,
          fontWeight: 600,
        }
      },
      textInput,
      textarea
    ]
  },
  text: {
    id: 'text',
    title: 'Text',
    elements: [
      {
        title: 'Semibold H1 Heading',
        type: 'text',
        tagName: 'h1',
        domID: '',
        className: '',
        content: 'H1 Heading',
        thumb: '/images/text/Heading-1.svg',
        dragProps: {
          rawWidth: 300,
          rawHeight: 50,
          width: '100%',
        },
        displayStyle: {
          wrapper: {
            width: '100%',
            height: '100px'
          },
          image: {
            width: '250px'
          }
        },
        style: {
          width: '100%',
          marginTop: '0',
          marginBottom: '10px',
          fontSize: '32px',
          lineHeight: 'normal',
          display: 'block',
        }
      },
      {
        title: 'Semibold H2 Heading',
        type: 'text',
        tagName: 'h2',
        domID: '',
        className: '',
        content: 'H2 Heading',
        thumb: '/images/text/Heading-2.svg',
        dragProps: {
          rawWidth: 300,
          rawHeight: 50,
          width: '100%',
        },
        displayStyle: {
          wrapper: {
            width: '100%',
            height: '100px'
          },
          image: {
            width: '187px'
          }
        },
        style: {
          width: '100%',
          marginTop: '0',
          marginBottom: '10px',
          fontSize: '24px',
          display: 'block',
        }
      },
      {
        title: 'Semibold H3 Heading',
        type: 'text',
        domID: '',
        className: '',
        tagName: 'h3',
        dragProps: {
          rawWidth: 300,
          rawHeight: 50,
          width: '100%',
        },
        content: 'H3 Heading',
        thumb: '/images/text/Heading-3.svg',
        displayStyle: {
          wrapper: {
            width: '100%',
            height: '100px'
          },
          image: {
            width: '144px'
          }
        },
        style: {
          width: '100%',
          marginTop: '0',
          marginBottom: '10px',
          fontSize: '18.5px',
          display: 'block',
        }
      },
      p,
      span,
      label
    ]
  },
}

export const scripts = [
  {
    title: 'Foundation 6',
    parentClass: 'use-foundation',
    id: 'foundation',
    scripts: [
      { path: '/frameworks/foundation/css/foundation.min.css', type: 'style' },
      { path: '/frameworks/foundation/js/foundation.min.js', type: 'script' },
      { path: '/frameworks/jquery/jquery-3.6.0.min.js', type: 'script' },
      { path: '/frameworks/what-input/what-input.js', type: 'script' },
    ]
  },
  {
    title: 'Bootstrap 4.6',
    parentClass: 'use-bootstrap',
    id: 'bootstrap',
    scripts: [
      { path: '/frameworks/jquery/jquery-3.6.0.min.js', type: 'script' },
      { path: '/frameworks/popperjs/popper.min.js', type: 'script' },
      { path: '/frameworks/bootstrap/js/bootstrap.min.js', type: 'script' },
      { path: '/frameworks/bootstrap/css/bootstrap.min.css', type: 'style' }
      
    ]
  },
  {
    title: 'Bulma',
    parentClass: 'use-bulma',
    id: 'bulma',
    scripts: [
      { path: '/frameworks/bootstrap/css/bootstrap.min.css', type: 'style' }
    ]
  }
]

export default constants
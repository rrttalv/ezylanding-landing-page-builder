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
      {
        title: '2 Columns',
        type: 'section',
        partitions: 2,
        thumb: '/images/sections/flex-row-2.svg',
        style: {
          display: 'flex',
          'flex-direction': 'row',
          width: '80%',
          margin: '0 auto',
          position: 'relative',
          height: '300px'
        },
        children: [
          {
            type: 'div',
            className: 'col-6',
            style: {
              position: 'relative',
              width: '50%',
              height: '100%'
            },
            children: [
              
            ]
          },
          {
            type: 'div',
            className: 'col-6',
            style: {
              position: 'relative',
              width: '50%',
              height: '100%'
            },
            children: []
          }
        ]
      },
      {
        title: '3 Columns',
        type: 'section',
        partitions: 3,
        thumb: '/images/sections/flex-row-3.svg',
        style: {
          display: 'flex',
          'flex-direction': 'row',
          width: '80%',
          margin: '0 auto',
          position: 'relative',
          height: '300px'
        },
        
        children: [
          {
            type: 'div',
            className: 'col-4',
            style: {
              position: 'relative',
              width: '33.3%',
              height: '100%'
            },
            children: []
          },
          {
            type: 'div',
            className: 'col-4',
            style: {
              position: 'relative',
              width: '33.3%',
              height: '100%'
            },
            children: []
          },
          {
            type: 'div',
            className: 'col-4',
            style: {
              position: 'relative',
              width: '33.3%',
              height: '100%'
            },
            children: []
          }
        ]
      },
      {
        title: '4 Columns',
        type: 'section',
        partitions: 4,
        thumb: '/images/sections/flex-row-4.svg',
        displayStyle: {
          wrapper: {},
          image: {
            padding: '0 10px'
          }
        },
        style: {
          display: 'flex',
          'flex-direction': 'row',
          width: '80%',
          margin: '0 auto',
          position: 'relative',
          height: '300px'
        },
      },
      {
        title: '2 Rows',
        type: 'section',
        partitions: 2,
        thumb: '',
        style: {
          display: 'flex',
          'flex-direction': 'row',
          width: '80%',
          margin: '0 auto',
          position: 'relative',
          height: '300px'
        },
      },
      {
        title: '3 Rows',
        type: 'section',
        partitions: 3,
        thumb: '',
        style: {
          display: 'flex',
          'flex-direction': 'row',
          width: '80%',
          margin: '0 auto',
          position: 'relative',
          height: '300px'
        },
      },
      {
        title: '4 Rows',
        type: 'section',
        partitions: 4,
        thumb: '',
        style: {
          display: 'flex',
          'flex-direction': 'row',
          width: '80%',
          margin: '0 auto',
          position: 'relative',
          height: '300px'
        },
      }
    ]
  },
  inputs: {
    id: 'inputs',
    title: 'Inputs',
    elements: [
      {
        title: 'Text input',
        type: 'input',
        inputType: 'textarea',
        className: 'form-control',
        labelData: {
          content: 'Text area label',
          style: {
            marginBottom: '10px',
            fontSize: '12px'
          }
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
        thumb: '/images/inputs/text-area.svg',
        style: {
          'borderRadius': '4px',
          width: '80%',
          height: '100px',
          margin: '0 auto',
          display: 'block',
          top: 0,
          left: 0,
          border: '1px solid rgba(0,0,0,0.175)'
        }
      },
      {
        type: 'div',

        title: 'Rounded button',
        type: 'button',
        className: 'btn',
        content: 'Click me!',
        thumb: '/images/inputs/regular-btn.svg',
        style: {
          'borderRadius': '4px',
          width: '100px',
          margin: '0 auto',
          display: 'block',
          background: '#3E41DC',
          color: '#fff',
          height: '35px',
          top: 0,
          fontSize: '14px',
          left: 0,
          border: '1px solid rgba(0,0,0,0.175)'
        }
      },
      {
        title: 'Box-shadow button',
        type: 'button',
        content: 'Click me!',
        thumb: '/images/inputs/box-shadow-btn.svg',
        style: {
          'borderRadius': '4px',
          width: '100px',
          height: '50px',
          margin: '0 auto',
          display: 'block',
          top: 0,
          left: 0,
          border: '1px solid rgba(0,0,0,0.175)'
        }
      },
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
        content: 'H1 Heading',
        thumb: '/images/text/Heading-1.svg',
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
          top: 0,
          left: 0
        }
      },
      {
        title: 'Semibold H2 Heading',
        type: 'text',
        tagName: 'h2',
        content: 'H2 Heading',
        thumb: '/images/text/Heading-2.svg',
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
          top: 0,
          left: 0
        }
      },
      {
        title: 'Semibold H3 Heading',
        type: 'text',
        tagName: 'h3',
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
          top: 0,
          left: 0
        }
      },
    ]
  }
}

export const scripts = [
  {
    title: 'Foundation 6',
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
    id: 'bulma',
    scripts: [
      { path: '/frameworks/bootstrap/css/bootstrap.min.css', type: 'style' }
    ]
  }
]

export default constants
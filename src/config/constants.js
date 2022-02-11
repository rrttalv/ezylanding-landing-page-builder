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
          padding: '3rem 0',
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
            children: []
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
          padding: '3rem 0',
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
          padding: '3rem 0',
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
          padding: '3rem 0',
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
          padding: '3rem 0',
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
          padding: '3rem 0',
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
          'border-radius': '4px',
          width: '80%',
          height: '100px',
          margin: '0 auto',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          border: '1px solid rgba(0,0,0,0.175)'
        }
      },
      {
        title: 'Rounded button',
        type: 'button',
        content: 'Click me!',
        thumb: '/images/inputs/regular-btn.svg',
        style: {
          'border-radius': '4px',
          width: '100px',
          height: '50px',
          margin: '0 auto',
          display: 'block',
          position: 'absolute',
          top: 0,
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
          'border-radius': '4px',
          width: '100px',
          height: '50px',
          margin: '0 auto',
          display: 'block',
          position: 'absolute',
          top: 0,
          left: 0,
          border: '1px solid rgba(0,0,0,0.175)'
        }
      },
    ]
  }
  

}

export default constants
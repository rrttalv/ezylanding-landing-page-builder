export const singleCard = {
  type: 'div',
  tagName: 'div',
  className: 'card',
  dragProps: {
    rawWidth: 288,
    rawHeight: 300,
    width: '18rem',
    height: '300px'
  },
  thumb: '/images/sections/flex-row-2.svg',
  style: {
    maxWidth: '18rem',
    boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.05)'
  },
  children: [
    {
      type: 'img',
      tagName: 'img',
      className: 'card-image',
      src: 'http://localhost:3000/images/icons/rocket.svg',
      style: {
        width: '50px',
        display: 'block',
        margin: '25px auto 15px auto',
      }
    },
    {
      type: 'div',
      tagName: 'div',
      className: 'card-body',
      style: {
        paddingTop: '0.5rem',
      },
      children: [
        {
          type: 'text',
          tagName: 'h5',
          className: 'card-title',
          style: {
            textAlign: 'center'
          },
          content: `Here's a card!`
        },
        {
          type: 'text',
          tagName: 'p',
          className: 'card-text',
          style: {
            textAlign: 'center'
          },
          content: `Describe something awesome that your customers want to hear
          about`
        },
        {
          type: 'button',
          tagName: 'button',
          className: 'btn btn-primary',
          style: {
            textAlign: 'center',
            display: 'block',
            width: 'fit-content',
            margin: '25px auto 15px auto'
          },
          content: `Learn More!`
        }
      ]
    }
  ]
}

export const cardSection = {
  type: 'section',
  tagName: 'section',
  thumb: '/images/sections/flex-row-2.svg',
  dragProps: {
    rawWidth: 500,
    rawHeight: 300,
    width: '100%',
    height: '300px'
  },
  style: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly'
  },
  children: [
    {
      type: 'div',
      tagName: 'div',
      className: 'card',
      thumb: '/images/sections/flex-row-2.svg',
      style: {
        maxWidth: '18rem',
        boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.05)'
      },
      children: [
        {
          type: 'img',
          tagName: 'img',
          className: 'card-image',
          src: 'http://localhost:3000/images/icons/rocket.svg',
          style: {
            width: '50px',
            display: 'block',
            margin: '25px auto 15px auto',
          }
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'card-body',
          style: {
            paddingTop: '0.5rem',
          },
          children: [
            {
              type: 'text',
              tagName: 'h5',
              className: 'card-title',
              style: {
                textAlign: 'center'
              },
              content: `Here's a card!`
            },
            {
              type: 'text',
              tagName: 'p',
              className: 'card-text',
              style: {
                textAlign: 'center'
              },
              content: `Describe something awesome that your customers want to hear
              about`
            },
            {
              type: 'button',
              tagName: 'button',
              className: 'btn btn-primary',
              style: {
                textAlign: 'center',
                display: 'block',
                width: 'fit-content',
                margin: '25px auto 15px auto'
              },
              content: `Learn More!`
            }
          ]
        }
      ]
    },
    {
      type: 'div',
      tagName: 'div',
      className: 'card',
      thumb: '/images/sections/flex-row-2.svg',
      style: {
        maxWidth: '18rem',
        boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.05)'
      },
      children: [
        {
          type: 'img',
          tagName: 'img',
          className: 'card-image',
          src: 'http://localhost:3000/images/icons/rocket.svg',
          style: {
            width: '50px',
            display: 'block',
            margin: '25px auto 15px auto',
          }
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'card-body',
          style: {
            paddingTop: '0.5rem',
          },
          children: [
            {
              type: 'text',
              tagName: 'h5',
              className: 'card-title',
              style: {
                textAlign: 'center'
              },
              content: `Here's a card!`
            },
            {
              type: 'text',
              tagName: 'p',
              className: 'card-text',
              style: {
                textAlign: 'center'
              },
              content: `Describe something awesome that your customers want to hear
              about`
            },
            {
              type: 'button',
              tagName: 'button',
              className: 'btn btn-primary',
              style: {
                textAlign: 'center',
                display: 'block',
                width: 'fit-content',
                margin: '25px auto 15px auto'
              },
              content: `Learn More!`
            }
          ]
        }
      ]
    },
    {
      type: 'div',
      tagName: 'div',
      className: 'card',
      thumb: '/images/sections/flex-row-2.svg',
      style: {
        maxWidth: '18rem',
        boxShadow: '0px 0px 4px 2px rgba(0,0,0,0.05)'
      },
      children: [
        {
          type: 'img',
          tagName: 'img',
          className: 'card-image',
          src: 'http://localhost:3000/images/icons/rocket.svg',
          style: {
            width: '50px',
            display: 'block',
            margin: '25px auto 15px auto',
          }
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'card-body',
          style: {
            paddingTop: '0.5rem',
          },
          children: [
            {
              type: 'text',
              tagName: 'h5',
              className: 'card-title',
              style: {
                textAlign: 'center'
              },
              content: `Here's a card!`
            },
            {
              type: 'text',
              tagName: 'p',
              className: 'card-text',
              style: {
                textAlign: 'center'
              },
              content: `Describe something awesome that your customers want to hear
              about`
            },
            {
              type: 'button',
              tagName: 'button',
              className: 'btn btn-primary',
              style: {
                textAlign: 'center',
                display: 'block',
                width: 'fit-content',
                margin: '25px auto 15px auto'
              },
              content: `Learn More!`
            }
          ]
        }
      ]
    }
  ]
}
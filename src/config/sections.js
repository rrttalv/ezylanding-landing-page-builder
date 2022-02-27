
export const flexRow2Col = {
  title: '2 Columns',
  type: 'section',
  tagName: 'section',
  partitions: 2,
  thumb: '/images/sections/flex-row-2.svg',
  dragProps: {
    rawWidth: 500,
    rawHeight: 300,
    width: '100%',
    height: '300px'
  },
  style: {
    width: '100%',
    margin: '0 auto',
    padding: '25px',
    position: 'relative',
    height: '300px',
    backgroundImage: `url(http://localhost:3000/images/static/blob-bg-1.png)`,
    backgroundSize: `cover`,
    backgroundRepeat: `repeat-x`
  },
  children: [
    {
      type: 'div',
      tagName: 'div',
      className: 'row',
      style: {
      },
      children: [
        {
          type: 'div',
          tagName: 'div',
          className: 'col-md-6',
          style: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          },
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'content-wrapper',
              style: {
                display: 'block',
                paddingTop: '50px',
                paddingBottom: '50px',
                width: '100%',
              },
              children: [
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'h1',
                  content: 'Work with professionals on demand!',
                  style: {
                    width: '100%',
                    fontSize: '3rem',
                    fontWeight: 700,
                    marginBottom: '15px',
                    lineHeight: '1.5',
                    display: 'block',
                  }
                },
                //FORM GROUP
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'form-group',
                  style: {
                    position: 'relative',
                    marginTop: '2rem'
                  },
                  children: [
                    {
                      type: 'text',
                      tagName: 'label',
                      className: 'label',
                      content: 'Want early access?',
                      style: {
                        width: '100%',
                        fontSize: '1.25rem',
                        color: `var(--gray)`,
                        fontWeight: 400,
                        marginBottom: '10px',
                        lineHeight: 'normal',
                        display: 'block',
                      }
                    },
                    {
                      type: 'input',
                      inputType: 'text',
                      tagName: 'input',
                      className: 'form-control',
                      placeHolder: 'Your email address',
                      style: {
                        borderRadius: '4px',
                        width: '250px',
                        maxWidth: '400px',
                        padding: '1rem 0.5rem',
                        display: 'inline-block',
                        border: `1px solid rgba(0,0,0,0.1)`,
                        boxShadow: `0px 3px 8px 1px rgba(0 0 0 / 8%)`,
                      }
                    },
                    {
                      type: 'button',
                      className: 'btn',
                      tagName: 'button',
                      content: 'Sign up!',
                      style: {
                        'borderRadius': '4px',
                        padding: '0.5rem 1rem',
                        verticalAlign: 'top',
                        marginLeft: '0.5rem',
                        display: 'inline-block',
                        background: '#6610f2',
                        color: '#fff',
                        fontSize: '14px',
                        border: '1px solid rgba(0,0,0,0.175)'
                      }
                    },
                  ]
                }
              ]
            }
          ]
        },
        /* Second row */
        {
          type: 'div',
          tagName: 'div',
          className: 'col-md-6',
          style: {
            position: 'relative',
          },
          children: [
            /*
            {
              type: 'img',
              tagName: 'img',
              className: 'image',
              style: {
                width: '100%',
                borderRadius: '4px'
              },
              src: "http://localhost:3000/images/static/workstation.jpg"
            },
            */
          ]
        },
      ]
    }
  ]
}
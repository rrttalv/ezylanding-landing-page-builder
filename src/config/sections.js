
export const flexRow2Col = {
  title: '2 Columns',
  type: 'section',
  tagName: 'section',
  partitions: 2,
  thumb: '/images/sections/flex-row-2.svg',
  style: {
    width: '100%',
    margin: '0 auto',
    padding: '25px',
    position: 'relative',
    height: '300px'
  },
  children: [
    {
      type: 'div',
      tagName: 'div',
      className: 'row',
      style: {},
      children: [
        {
          type: 'div',
          tagName: 'div',
          className: 'col-md-6',
          style: {
            position: 'relative',
            height: '100%'
          },
          children: [
            {
              type: 'text',
              tagName: 'h1',
              className: 'h1',
              content: 'Write something cool here!',
              style: {
                width: '100%',
                fontSize: '32px',
                fontWeight: 600,
                marginBottom: '15px',
                lineHeight: '1.5',
                display: 'block',
              }
            },
            {
              type: 'text',
              tagName: 'p',
              className: 'paragraph',
              content: 'Write something cool here!',
              style: {
                fontSize: '20px',
                fontWeight: 500,
                width: '100%',
                marginBottom: '10px',
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
              },
              children: [
                {
                  type: 'text',
                  tagName: 'label',
                  className: 'label',
                  content: 'Sign up for our newsletter!',
                  style: {
                    width: '100%',
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
                  style: {
                    'borderRadius': '4px',
                    width: '250px',
                    display: 'inline-block',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }
                },
                {
                  type: 'button',
                  className: 'btn',
                  tagName: 'button',
                  content: 'Sign up!',
                  style: {
                    'borderRadius': '4px',
                    width: '100px',
                    marginLeft: '15%',
                    marginTop: '100px',
                    display: 'inline-block',
                    background: '#3E41DC',
                    color: '#fff',
                    height: '35px',
                    fontSize: '14px',
                    border: '1px solid rgba(0,0,0,0.175)'
                  }
                },
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
            height: '100%'
          },
          children: [
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
          ]
        },
      ]
    }
  ]
}
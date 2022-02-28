
export const flexRow2Col = {
  title: '2 Columns',
  type: 'section',
  tagName: 'section',
  className: 'section',
  domID: '',
  thumb: '/images/sections/flex-row-2.svg',
  dragProps: {
    rawWidth: 500,
    rawHeight: 300,
    width: '100%',
    height: '300px'
  },
  style: {
    position: 'relative',
  },
  children: [
    {
      type: 'div',
      tagName: 'div',
      className: 'row',
      bootstrapClass: 'row',
      style: {},
      children: [
        {
          type: 'div',
          tagName: 'div',
          className: 'col-md-12 col-lg-6 col-xl-5',
          bootstrapClass: 'col-md-12 col-lg-6 col-xl-5',
          style: {},
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'content-wrapper',
              style: {
                padding: '25px',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                flexDirection: 'column',
              },
              children: [
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'two-col section-text',
                  content: 'The Final Solution',
                  style: {
                    color: 'var(--dark)',
                    fontWeight: 700
                  },
                },
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'two-col text-main-lead',
                  content: 'To all of your problems!',
                  style: {
                    color: 'var(--main)',
                    fontWeight: 700
                  },
                },
                {
                  type: 'text',
                  tagName: 'p',
                  className: 'lead-text',
                  content: 'At vero eos et accusamus et iusto odio dignissimos! Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
                  style: {
                    color: 'var(--gray)',
                    maxWidth: '500px'
                  },
                },
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'two-col buttons',
                  style: {
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center'
                  },
                  children: [
                    {
                      type: 'button',
                      tagName: 'button',
                      className: 'btn two-col btn-main',
                      bootstrapClass: 'btn',
                      content: 'Get Started',
                      style: {
                        background: 'var(--main)',
                        color: 'var(--white)',
                        fontWeight: 600,
                      }
                    },
                    {
                      type: 'button',
                      tagName: 'button',
                      className: 'btn two-col btn-second',
                      bootstrapClass: 'btn',
                      content: 'Get Demo',
                      style: {
                        background: 'var(--secondary)',
                        color: 'var(--main)',
                        fontWeight: 600,
                        marginLeft: '10px'
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'col-md-12 col-lg-6 col-xl-7',
          bootstrapClass: 'col-md-12 col-lg-6 col-xl-7',
          style: {},
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'content-wrapper',
              style: {
                padding: '25px',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                flexDirection: 'column',
              },
              children: [
                {
                  type: 'img',
                  tagName: 'img',
                  className: 'two-col large-image',
                  src: 'http://localhost:3000/images/static/office-worker.jpeg',
                  style: {
                    width: '95%',
                    display: 'block',
                    margin: '0 auto',
                    borderRadius: '10px'
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
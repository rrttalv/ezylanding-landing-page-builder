
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
    padding: '25px'
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

export const largeColumn = {
  title: 'Large column',
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
          className: 'col-12',
          bootstrapClass: 'large-col col-12',
          style: {
            padding: '20px'
          },
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'large-content-wrapper',
              style: {
                position: 'relative',
                padding: '75px 15px',
                display: 'flex',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
              },
              children: [
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'content-bg',
                  style: {
                    background: 'url(http://localhost:3000/images/static/office-worker.jpeg)',
                    borderRadius: '10px',
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '100%',
                    height: '100%',
                    zIndex: '-2',
                  },
                  children: [
                    {
                      type: 'div',
                      tagName: 'div',
                      className: 'content-background-overlay',
                      style: {
                        zIndex: '-1',
                        background: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '10px',
                        position: 'absolute',
                        top: '0',
                        left: '0',
                        width: '100%',
                        height: '100%',
                      }
                    }
                  ]
                },
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'large-col text-main',
                  content: 'The Final Solution',
                  style: {
                    color: 'var(--white)',
                    fontWeight: 700
                  },
                },
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'large-col text-main',
                  content: 'To all of your problems!',
                  style: {
                    color: 'var(--white)',
                    fontWeight: 700
                  },
                },
                {
                  type: 'text',
                  tagName: 'p',
                  className: 'large-col lead-text',
                  content: 'At vero eos et accusamus et iusto odio dignissimos! Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
                  style: {
                    color: 'var(--secondary)',
                    maxWidth: '500px',
                    textAlign: 'center'
                  },
                },
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'large-col buttons-wrapper',
                  style: {
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center'
                  },
                  children: [
                    {
                      type: 'button',
                      tagName: 'button',
                      className: 'large-col btn btn-main',
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
                      className: 'large-col btn btn-second',
                      bootstrapClass: 'btn',
                      content: 'Get Demo',
                      style: {
                        background: 'var(--white)',
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
        }
      ]
    }
  ]
}

export const features1 = {
  title: 'Features list #1',
  type: 'section',
  tagName: 'section',
  className: 'features',
  domID: '',
  thumb: '/images/sections/flex-row-2.svg',
  dragProps: {
    rawWidth: 500,
    rawHeight: 300,
    padding: '15px',
    width: '100%',
    height: '300px'
  },
  style: {
    position: 'relative',
    padding: '25px'
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
          className: 'col-12',
          bootstrapClass: 'col-12',
          style: {
          },
          children: [
            {
              type: 'text',
              tagName: 'h2',
              className: 'features-title',
              content: "Here's all the awesome stuff we can do!",
              style: {
                color: 'var(--main)',
                maxWidth: '600px',
                fontWeight: 700
              },
            },
            {
              type: 'text',
              tagName: 'h5',
              className: 'features-subtitle',
              content: 'At vero eos et accusamus et iusto odio dignissimos! Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
              style: {
                color: 'var(--gray)',
                maxWidth: '600px',
                marginTop: '10px',
                fontWeight: 'normal'
              },
            },
          ]
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'col-sm-12 col-md-6 col-xl-3',
          bootstrapClass: 'col-sm-12 col-md-6 col-xl-3',
          style: {
          },
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'feature-wrapper',
              style: {
                display: 'flex',
                marginTop: '15px',
              },
              children: [
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-img',
                  style: {
                    marginRight: '15px',
                    padding: '10px',
                    backgroundColor: 'var(--secondary)',
                    height: 'fit-content',
                    borderRadius: '10px',
                  },
                  children: [
                    {
                      type: 'img',
                      tagName: 'img',
                      className: 'feature-img-content',
                      src: 'http://localhost:3000/images/static/message.png',
                      style: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                      }
                    }
                  ]
                },
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-body',
                  style: {
                  },
                  children: [
                    {
                      type: 'text',
                      tagName: 'h6',
                      className: 'feature-body-heading',
                      content: 'Awesome feature #1',
                      style: {
                        color: 'var(--dark)',
                      },
                    },
                    {
                      type: 'text',
                      tagName: 'p',
                      className: 'feature-body-text',
                      content: 'At vero eos et accusamus et iusto odio dignissimos! Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
                      style: {
                        color: 'var(--gray)',
                        maxWidth: '400px',
                      },
                    },
                  ]
                }
              ]
            },
          ]
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'col-sm-12 col-md-6 col-xl-3',
          bootstrapClass: 'col-sm-12 col-md-6 col-xl-3',
          style: {
          },
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'feature-wrapper',
              style: {
                display: 'flex',
                marginTop: '15px',
              },
              children: [
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-img',
                  style: {
                    marginRight: '15px',
                    padding: '10px',
                    backgroundColor: 'var(--secondary)',
                    height: 'fit-content',
                    borderRadius: '10px',
                  },
                  children: [
                    {
                      type: 'img',
                      tagName: 'img',
                      className: 'feature-img-content',
                      src: 'http://localhost:3000/images/static/bolt.png',
                      style: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                      }
                    }
                  ]
                },
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-body',
                  style: {
                  },
                  children: [
                    {
                      type: 'text',
                      tagName: 'h6',
                      className: 'feature-body-heading',
                      content: 'Awesome feature #2',
                      style: {
                        color: 'var(--dark)',
                      },
                    },
                    {
                      type: 'text',
                      tagName: 'p',
                      className: 'feature-body-text',
                      content: 'At vero eos et accusamus et iusto odio dignissimos! Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
                      style: {
                        color: 'var(--gray)',
                        maxWidth: '400px',
                      },
                    },
                  ]
                }
              ]
            },
          ]
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'col-sm-12 col-md-6 col-xl-3',
          bootstrapClass: 'col-sm-12 col-md-6 col-xl-3',
          style: {
          },
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'feature-wrapper',
              style: {
                display: 'flex',
                marginTop: '15px',
              },
              children: [
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-img',
                  style: {
                    marginRight: '15px',
                    padding: '10px',
                    backgroundColor: 'var(--secondary)',
                    height: 'fit-content',
                    borderRadius: '10px',
                  },
                  children: [
                    {
                      type: 'img',
                      tagName: 'img',
                      className: 'feature-img-content',
                      src: 'http://localhost:3000/images/static/rocket.png',
                      style: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                      }
                    }
                  ]
                },
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-body',
                  style: {
                  },
                  children: [
                    {
                      type: 'text',
                      tagName: 'h6',
                      className: 'feature-body-heading',
                      content: 'Awesome feature #3',
                      style: {
                        color: 'var(--dark)',
                      },
                    },
                    {
                      type: 'text',
                      tagName: 'p',
                      className: 'feature-body-text',
                      content: 'At vero eos et accusamus et iusto odio dignissimos! Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
                      style: {
                        color: 'var(--gray)',
                        maxWidth: '400px',
                      },
                    },
                  ]
                }
              ]
            },
          ]
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'col-sm-12 col-md-6 col-xl-3',
          bootstrapClass: 'col-sm-12 col-md-6 col-xl-3',
          style: {
          },
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'feature-wrapper',
              style: {
                display: 'flex',
                marginTop: '15px',
              },
              children: [
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-img',
                  style: {
                    marginRight: '15px',
                    padding: '10px',
                    backgroundColor: 'var(--secondary)',
                    height: 'fit-content',
                    borderRadius: '10px',
                  },
                  children: [
                    {
                      type: 'img',
                      tagName: 'img',
                      className: 'feature-img-content',
                      src: 'http://localhost:3000/images/static/dollar.png',
                      style: {
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                      }
                    }
                  ]
                },
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'feature-body',
                  style: {
                  },
                  children: [
                    {
                      type: 'text',
                      tagName: 'h6',
                      className: 'feature-body-heading',
                      content: 'Awesome feature #4',
                      style: {
                        color: 'var(--dark)',
                      },
                    },
                    {
                      type: 'text',
                      tagName: 'p',
                      className: 'feature-body-text',
                      content: 'At vero eos et accusamus et iusto odio dignissimos! Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime.',
                      style: {
                        color: 'var(--gray)',
                        maxWidth: '400px',
                      },
                    },
                  ]
                }
              ]
            },
          ]
        }
      ]
    }
  ]
}
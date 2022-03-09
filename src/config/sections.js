
//C:\Users\Rico\Documents\ezylanding\ezylanding-app\public\images\components\sections

export const flexRow2Col = {
  title: '2 Columns',
  type: 'section',
  tagName: 'section',
  className: 'section',
  domID: '',
  thumb: '/images/components/sections/2-part-section.jpg',
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
                  className: 'text-dark',
                  content: 'The Final Solution',
                  style: {
                    color: 'var(--dark)',
                    fontWeight: 700
                  },
                },
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'text-main',
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
                      className: 'btn btn-main',
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
                      className: 'btn btn-second',
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
                  className: 'rounded large-image',
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
  thumb: '/images/components/sections/large-section.jpg',
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
                background: 'linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)), url(http://localhost:3000/images/static/office-worker.jpeg)',
                borderRadius: '10px',
              },
              children: [
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'text-white',
                  content: 'The Final Solution',
                  style: {
                    color: 'var(--white)',
                    fontWeight: 700
                  },
                },
                {
                  type: 'text',
                  tagName: 'h1',
                  className: 'text-white',
                  content: 'To all of your problems!',
                  style: {
                    color: 'var(--white)',
                    fontWeight: 700
                  },
                },
                {
                  type: 'text',
                  tagName: 'p',
                  className: 'text-second',
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
                      className: 'btn btn-main',
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
                      className: 'btn btn-second',
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
  thumb: '/images/components/sections/features-1.jpg',
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
                marginTop: '5px',
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
                marginTop: '25px',
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
                      type: 'svg',
                      tagName: 'svg',
                      inlineStyles: true,
                      className: 'feature-svg',
                      content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.59 40.14"><defs><style>.cls-1{fill:none;stroke:inherit;stroke-linecap:round;stroke-linejoin:round;stroke-width:1px;}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2"><path class="cls-1" d="M21.46,1C9.83,1,1,8.74,1,18.28a12.83,12.83,0,0,0,5.41,11h0A15.59,15.59,0,0,1,6,37.4a1.35,1.35,0,0,0,1.74,1.66l10.59-3.75a23.26,23.26,0,0,0,3.26.25c11.63,0,21-7.74,21-17.28S33.09,1,21.46,1Z"/><path class="cls-1" d="M18.15,35.31a23.69,23.69,0,0,1-6.8-2.44"/><circle cx="12.84" cy="18.87" r="2.37"/><circle cx="22.12" cy="18.87" r="2.37"/><circle cx="31.4" cy="18.87" r="2.37"/></g></g></svg>`,
                      style: {
                        fill: 'var(--main)',
                        stroke: 'var(--main)',
                        width: '30px',
                        height: '30px'
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
                      className: 'text-dark',
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
                marginTop: '25px',
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
                      type: 'svg',
                      tagName: 'svg',
                      inlineStyles: true,
                      className: 'feature-svg',
                      content: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
                      style: {
                        stroke: 'var(--main)',
                        width: '30px',
                        height: '30px',
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
                      className: 'text-dark',
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
                marginTop: '25px',
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
                      type: 'svg',
                      tagName: 'svg',
                      inlineStyles: true,
                      className: 'feature-svg',
                      content: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve" fill="none" stroke="currentColor"><circle cx="16" cy="13" r="2"/><path d="M10,15.9c-1.9,1.5-3.4,3.6-4,6.1h2.3c1.5,0,2.6-1.4,2.2-2.8c-0.4-1.4-0.6-2.8-0.6-4.3C10,9.4,12.5,4.7,16,3c3.5,1.7,6,6.4,6,11.8c0,1.5-0.2,3-0.6,4.3c-0.4,1.4,0.7,2.8,2.2,2.8H26c-0.6-2.5-2.1-4.7-4-6.1"/><line stroke="inherit" x1="16" y1="22" x2="16" y2="30"/><line x1="13" y1="24" x2="13" y2="28"/><line x1="19" y1="24" x2="19" y2="28"/></svg>',
                      style: {
                        stroke: 'var(--main)',
                        width: '30px',
                        height: '30px',
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
                      className: 'text-dark',
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
                marginTop: '25px',
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
                      type: 'svg',
                      tagName: 'svg',
                      inlineStyles: true,
                      className: 'feature-svg',
                      content: `<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                        <g id="63.-Lighting-bolt" stroke="inherit" stroke-width="4" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                        <g transform="translate(16.000000, 2.000000)" id="Layer-1" stroke="inherit" stroke-width="4">
                        <path d="M38.9948707,37.6837978 L38.9948707,3.16090149 C38.9948707,-0.55368264 37.3015616,-1.07285404 35.212759,2.02111931 L0.9889463,52.7140687 C-1.10326869,55.8130965 0.233575023,58.316203 3.96724852,58.316203 L28.5478613,58.316203 L28.5478616,92.8390986 C28.5478616,96.5536827 30.2411708,97.072854 32.3299734,93.9788807 L66.5537861,43.2859313 C68.6460011,40.1869035 67.3091573,37.6837971 63.5754837,37.6837972 L38.9948707,37.6837978 L38.9948707,37.6837978 Z"></path>
                        </g>
                        </g>
                      </svg>`,
                      style: {
                        stroke: 'var(--main)',
                        width: '30px',
                        height: '30px',
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
                      className: 'text-dark',
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
export const features2 = {
  title: 'Features list #2',
  type: 'section',
  tagName: 'section',
  className: 'features',
  domID: '',
  thumb: '/images/components/sections/features-2.jpg',
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
          className: 'col-sm-12 col-md-8',
          bootstrapClass: 'col-sm-12 col-md-8',
          style: {},
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'col-sm-12 col-md-8',
              bootstrapClass: 'col-sm-12 col-md-8',
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
                    maxWidth: '550px',
                    marginTop: '5px',
                    fontWeight: 'normal'
                  },
                },
              ]
            },
            {
              type: 'div',
              tagName: 'div',
              className: 'row',
              bootstrapClass: 'row',
              style: {
              },
              children: [
                {
                  type: 'div',
                  tagName: 'div',
                  className: 'col-sm-12 col-xl-6',
                  bootstrapClass: 'col-sm-12 col-xl-6',
                  style: {
                  },
                  children: [
                    {
                      type: 'div',
                      tagName: 'div',
                      className: 'feature-wrapper',
                      style: {
                        display: 'flex',
                        marginTop: '30px',
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
                              type: 'svg',
                              tagName: 'svg',
                              inlineStyles: true,
                              className: 'feature-svg',
                              content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 43.59 40.14"><defs><style>.cls-1{fill:none;stroke:inherit;stroke-linecap:round;stroke-linejoin:round;stroke-width:1px;}</style></defs><title>Asset 1</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_2-2" data-name="Layer 2"><path class="cls-1" d="M21.46,1C9.83,1,1,8.74,1,18.28a12.83,12.83,0,0,0,5.41,11h0A15.59,15.59,0,0,1,6,37.4a1.35,1.35,0,0,0,1.74,1.66l10.59-3.75a23.26,23.26,0,0,0,3.26.25c11.63,0,21-7.74,21-17.28S33.09,1,21.46,1Z"/><path class="cls-1" d="M18.15,35.31a23.69,23.69,0,0,1-6.8-2.44"/><circle cx="12.84" cy="18.87" r="2.37"/><circle cx="22.12" cy="18.87" r="2.37"/><circle cx="31.4" cy="18.87" r="2.37"/></g></g></svg>`,
                              style: {
                                fill: 'var(--main)',
                                stroke: 'var(--main)',
                                width: '30px',
                                height: '30px'
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
                              className: 'text-dark',
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
                  className: 'col-sm-12 col-xl-6',
                  bootstrapClass: 'col-sm-12 col-xl-6',
                  style: {
                  },
                  children: [
                    {
                      type: 'div',
                      tagName: 'div',
                      className: 'feature-wrapper',
                      style: {
                        display: 'flex',
                        marginTop: '30px',
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
                              type: 'svg',
                              tagName: 'svg',
                              inlineStyles: true,
                              className: 'feature-svg',
                              content: '<svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-dollar-sign"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>',
                              style: {
                                stroke: 'var(--main)',
                                width: '30px',
                                height: '30px',
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
                              className: 'text-dark',
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
                  className: 'col-sm-12 col-xl-6',
                  bootstrapClass: 'col-sm-12 col-xl-6',
                  style: {
                  },
                  children: [
                    {
                      type: 'div',
                      tagName: 'div',
                      className: 'feature-wrapper',
                      style: {
                        display: 'flex',
                        marginTop: '30px',
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
                              type: 'svg',
                              tagName: 'svg',
                              inlineStyles: true,
                              className: 'feature-svg',
                              content: '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 32 32" style="enable-background:new 0 0 32 32;" xml:space="preserve" fill="none" stroke="currentColor"><circle cx="16" cy="13" r="2"/><path d="M10,15.9c-1.9,1.5-3.4,3.6-4,6.1h2.3c1.5,0,2.6-1.4,2.2-2.8c-0.4-1.4-0.6-2.8-0.6-4.3C10,9.4,12.5,4.7,16,3c3.5,1.7,6,6.4,6,11.8c0,1.5-0.2,3-0.6,4.3c-0.4,1.4,0.7,2.8,2.2,2.8H26c-0.6-2.5-2.1-4.7-4-6.1"/><line stroke="inherit" x1="16" y1="22" x2="16" y2="30"/><line x1="13" y1="24" x2="13" y2="28"/><line x1="19" y1="24" x2="19" y2="28"/></svg>',
                              style: {
                                stroke: 'var(--main)',
                                width: '30px',
                                height: '30px',
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
                              className: 'text-dark',
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
                  className: 'col-sm-12 col-xl-6',
                  bootstrapClass: 'col-sm-12 col-xl-6',
                  style: {
                  },
                  children: [
                    {
                      type: 'div',
                      tagName: 'div',
                      className: 'feature-wrapper',
                      style: {
                        display: 'flex',
                        marginTop: '30px',
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
                              type: 'svg',
                              tagName: 'svg',
                              inlineStyles: true,
                              className: 'feature-svg',
                              content: `<svg width="100px" height="100px" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <g id="63.-Lighting-bolt" stroke="inherit" stroke-width="4" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round">
                                <g transform="translate(16.000000, 2.000000)" id="Layer-1" stroke="inherit" stroke-width="4">
                                <path d="M38.9948707,37.6837978 L38.9948707,3.16090149 C38.9948707,-0.55368264 37.3015616,-1.07285404 35.212759,2.02111931 L0.9889463,52.7140687 C-1.10326869,55.8130965 0.233575023,58.316203 3.96724852,58.316203 L28.5478613,58.316203 L28.5478616,92.8390986 C28.5478616,96.5536827 30.2411708,97.072854 32.3299734,93.9788807 L66.5537861,43.2859313 C68.6460011,40.1869035 67.3091573,37.6837971 63.5754837,37.6837972 L38.9948707,37.6837978 L38.9948707,37.6837978 Z"></path>
                                </g>
                                </g>
                              </svg>`,
                              style: {
                                stroke: 'var(--main)',
                                width: '30px',
                                height: '30px',
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
                              className: 'text-dark',
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
                },
              ]
            }
          ]
        },
        {
          type: 'div',
          tagName: 'div',
          className: 'd-md-block col-md-4 d-sm-none d-none col-sm-12',
          style: {},
          children: [
            {
              type: 'div',
              tagName: 'div',
              className: 'features-vertical',
              style: {
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: [
                {
                  type: 'img',
                  tagName: 'img',
                  className: 'features-vertical-img',
                  recommendVertical: true,
                  style: {
                    width: '100%',
                    display: 'block'
                  },
                  src: "https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
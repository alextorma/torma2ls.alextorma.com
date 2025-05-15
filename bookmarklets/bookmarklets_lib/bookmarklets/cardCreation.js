export const cardCreation = () => {
  (async () => {
    (async () => {
      window.dmSansLoaded = new Promise(resolve => {
        [
          { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
          { rel: 'preconnect', href: 'https://fonts.gstatic.com', attr: 'crossorigin' },
          { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap' }
        ].forEach(({ rel, href, attr }) => {
          const link = document.createElement('link');
          link.rel = rel;
          link.href = href;
          if (attr) link.setAttribute(attr, '');
          document.head.appendChild(link);
        });
        document.querySelector(`link[href*='DM+Sans']`).addEventListener('load', async () =>
          await document.fonts.load(`18px 'DM Sans'`) && await document.fonts.ready && resolve()
        );
      });
      document.head.appendChild((() => {
        const style = document.createElement('style');
        style.innerHTML = `.mceText { font-family: 'DM Sans' }`;
        return style;
      })());
    })();
    await window.dmSansLoaded;
    (() => {
      const createElem = ({ tag, ...props }, target = null) => {
        if (tag === 'noop') return;
        const element = document.createElement(tag);
        Object.entries(props).forEach(([key, value]) => {
          if (key === 'children' && Array.isArray(value)) value.filter(Boolean).forEach(child => element.appendChild(child));
          else if (key === 'classList' && Array.isArray(value)) value.forEach(cls =>
            (cls.trim() !== '' && cls !== null && cls !== undefined) && element.classList.add(cls));
          else if (key && value !== undefined) element[key] = value;
        });
        if (target) target.appendChild(element);
        return element;
      };
      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => console.log('Text copied to clipboard'))
          .catch(err => console.error('Failed to copy text: ', err));
      };

      const clean = e => typeof e === 'string' ? e.trim().replace(/\n* +/g, '_') : e.textContent.trim().replace(/\n* +/g, ' ');

      const cardsInfo = {};
      const headerStyles = {
        height: 70,
        width: 135,
        titleFontSize: 18,
        headerSize: {
          rank: 26,
          get title() { return headerStyles.width - 10 - this.rank }
        }
      };
      const styleTag = {
        'root': {
          '--card-header-bg-color': '#1c1c84',
          '--merch-card-margin': '12px',
        },
        'merch-cards *, .merch-cards *::before, .merch-cards *::after': {
          'box-sizing': 'border-box',
          'margin': '0',
          'padding': '0',
          'border': '0'
        },
        'merch-cards, .card-info': {
          'border-spacing': '0',
          'border-collapse': 'collapse',
        },
        'card-header': {
          'display': 'block',
          'background-color': 'var(--card-header-bg-color)',
          'color': '#ffffff',
          'padding': '0 4px',
        },
        'merch-cards': {
          'margin': 'var(--merch-card-margin) auto',
          'text-align': 'center'
        },
        'merch-card': {
          'display': 'inline-table',
          'width': `${headerStyles.width}px`,
          'min-height': '192px',
          'margin': 'var(--merch-card-margin)',
          'background-color': '#ffffff',
        },
        'card-info': { 'border': '1px solid #dddddd' },
        'content-rank': { 'font-size': '20px' },
        'content-title': { 'font-size': `${headerStyles.titleFontSize}px` },
        'content-title span': { 'width': '100%' },
        'card-body': { 'text-align': 'center', },
        'content-other': {
          'display': 'inline-block',
          'min-width': '48%',
          'font-size': '14px',
          'margin': '4px 0'
        },
        'content-title-impressions': { 'width': '100%' },
        'span-key': { 'font-size': '12px' },
        'span-value': { 'font-weight': 'bold' },
        'span-container': { 'height': '100%', },
      };

      const createStyle = (target, spacer = '\u0020\u0020\u0020\u0020') => {
        const cssRules = (obj) => Object.entries(obj).map(([prop, value]) => `${prop}: ${value}`).join(`;\n${spacer}`)
        const fmtdCSS = Object.entries(styleTag).map(([selector, rules]) =>`${selector === 'root' ? ':' : '.'}${selector} {\n${spacer}${cssRules(rules)};\n}`).join('\n')
        return target.innerHTML = `\n${fmtdCSS}\n`;
      }

      const updateStyles = (card, title) => {
        if (typeof title === 'string') {
          const container = createElem({
            tag: 'div',
            classList: ['sizing-table', 'merch-card'],
            children: [
              createElem({
                tag: 'style',
                innerHTML: (() => createStyle(this))()
              }),
              createElem({
                tag: 'table',
                classList: ['card-info', 'mceText'],
                children: [createElem({
                  tag: 'thead',
                  classList: ['card-header'],
                  children: [createElem({
                    tag: 'tr',
                    children: [
                      createElem({
                        tag: 'th',
                        vAlign: 'top',
                        align: 'left',
                        width: headerStyles.headerSize.rank,
                        classList: ['content-rank'],
                        children: [createElem({
                          tag: 'div',
                          children: [createElem({
                            tag: 'span',
                            textContent: card.split('_')[0].replace(/num/, '')
                          })]
                        })]
                      }),
                      createElem({
                        tag: 'th',
                        vAlign: 'bottom',
                        align: 'right',
                        height: headerStyles.height,
                        width: headerStyles.headerSize.title,
                        classList: ['content-title'],
                        children: [createElem({
                          tag: 'div',
                          children: [createElem({
                            tag: 'span',
                            textContent: title
                          })]
                        })],
                      })]
                  })]
                })]
              })]
          }, document.body);
          let fontSize = headerStyles.titleFontSize;

          while (fontSize > 8) {
            const table = container.childNodes[1];
            const titleElem = table.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
            const setFontSize = () => titleElem.style.fontSize = `${fontSize}px`;
            const textHeight = (font) => {
              const { textContent } = titleElem;
              titleElem.textContent = '@';
              const height = titleElem.offsetHeight
              titleElem.textContent = textContent;
              return height;
            };
            const lineHeight = (font) => {
              const computedHeight = getComputedStyle(titleElem).lineHeight.replace(/px/, '');
              return (computedHeight === 'normal') ? textHeight(font) / font : parseInt(Math.ceil(computedHeight));
            };
            const numberOfLines = (font) => Math.ceil(titleElem.offsetHeight / (font * lineHeight(font)));
            if ((table.scrollWidth >= headerStyles.width || titleElem.getBoundingClientRect().width >= headerStyles.headerSize.title * 0.98) || numberOfLines(fontSize) >= 2) {
              if ((table.scrollWidth === headerStyles.width && titleElem.getBoundingClientRect().width < headerStyles.headerSize.title * 0.98) && numberOfLines(fontSize) <= 2) break;
              fontSize--;
              setFontSize();
            };
          };
          document.body.removeChild(container);
          if (fontSize !== headerStyles.titleFontSize) styleTag[`${card} .content-title`] = { 'font-size': `${fontSize}px` };
        };
      };

      const readData = () => {
        const data = {};
        document.querySelectorAll('tr:not(:first-child) td:first-child').forEach((td, i) => {
          const rowMap = new Map();
          td.parentNode.querySelectorAll('td').forEach((cell, ini) =>
            rowMap.set([
              ...new Map([
                ...document.querySelectorAll('tr:first-child td')
              ].map(td => [clean(td) === '' ? 'Rank' : clean(td), ''])).keys()
            ][ini], clean(cell)));
          data[`num${i}_${rowMap.get('Title').replace(/:| /g, '-')}`] = Object.fromEntries(rowMap);
        });

        document.querySelector('table').remove();
        return data;
      };

      const merchCards = createElem({
        tag: 'div',
        classList: ['merch-cards-section'],
        children: [
          createElem({
            tag: 'style',
            innerHTML: (() => createStyle(this))()
          }),
          createElem({
            tag: 'table',
            classList: ['merch-cards', 'mceText'],
            children: [createElem({
              tag: 'tbody',
              children: [createElem({
                tag: 'tr',
                children: Object.entries(readData()).map(([key, value]) => createElem({
                  tag: 'td',
                  classList: ['merch-card', `${key}`],
                  children: (() => {
                    if (cardsInfo[key]) return;
                    cardsInfo[key] = { header: new Map(), body: new Map() };
                    Object.entries(value).forEach(([k, v]) => {
                      if (k === 'Rank' || k === 'Title') cardsInfo[key].header.set(k, v);
                      else cardsInfo[key].body.set(k, v);
                    });
                  })()
                }))
              })]
            })]
          })]
      });

      merchCards.childNodes[1].childNodes[0].childNodes[0].childNodes.forEach(card => {
        if (!card.classList.contains('merch-card')) return;
        const cardInfo = cardsInfo[card.classList[1]];
        if (cardInfo) createElem({
          tag: 'table',
          classList: ['card-info'],
          children: ['card-header', 'card-body'].map(section => createElem({
            tag: section === 'card-header' ? 'thead' : 'tbody',
            classList: [section],
            children: [createElem({
              tag: 'tr',
              children: [...cardInfo[`${section.replace(/card-/, '')}`]].map(([key, value]) => createElem({
                tag: section === 'card-header' ? 'th' : 'td',
                vAlign: key === 'Title' ? 'bottom' : key === 'Rank' ? 'top' : '',
                align: key === 'Title' ? 'right' : key === 'Rank' ? 'left' : 'center',
                height: key === 'Title' && headerStyles.height,
                width: key === 'Title' ? headerStyles.headerSize.title : key === 'Rank' ? headerStyles.headerSize.rank : '',
                classList: (() => { if (key === 'Title') updateStyles(`${card.classList[1]}`, value); return (key !== 'Rank' && key !== 'Title') ? ['content-other', clean(`content-${key.replace(/ +/g, '-').toLowerCase()}`)] : [clean(`content-${key.toLowerCase()}`)] })(),
                children: (() => {
                  return [
                    (section === 'card-body') && createElem({
                      tag: 'div',
                      classList: ['span-key'],
                      children: [createElem({
                        tag: 'span',
                        textContent: (() => {
                          if (key === 'Title Impressions' || key === 'Video Hours') return `${key.split(' ')[1]}`;
                          return key;
                        })()
                      })]
                    }),
                    createElem({
                      tag: 'div',
                      classList: [(key !== 'Rank' && key !== 'Title') ? 'span-value' : `span-${value.replace(/ /g, '-').toLowerCase()}`],
                      children: [createElem({
                        tag: 'span',
                        textContent: value
                      })]
                    })
                  ]
                })()
              }))
            })]
          }))
        }, card);
      });
      createStyle(merchCards.childNodes[0]);

      const copyButton = createElem({
        tag: 'div',
        style: ['width: 100%;'],
        children: [
          createElem({
            tag: 'button',
            style: ['margin: auto; display: block;'],
            onclick: () => copyToClipboard(merchCards.outerHTML),
            textContent: 'Copy HTML to Clipboard',
          })
        ]
      });
      [copyButton, merchCards].forEach(elem => document.body.appendChild(elem));
    })();
  })();
};

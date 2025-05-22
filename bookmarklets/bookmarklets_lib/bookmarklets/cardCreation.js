export const cardCreation = () => {
  (async () => {
    const policy = window.trustedTypes.createPolicy('cardCreation', {
      createHTML: (input) => input
    });
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
      document.head.appendChild((() => {
        const meta = document.createElement('meta');
        meta.name = 'darkreader-lock';
        return meta;
      })())
    });
    await window.dmSansLoaded;
    (() => {
      const createStyle = ({ source: source, target: target = null, type: type = null, update: update = null }) => {
        if (type && !['inline', 'tag', 'virtual'].includes(type)) return;
        switch (type) {
          case 'inline':
            Object.entries(source).forEach(([selector, propertiesToApply]) => {
              try {
                document.querySelectorAll(selector).forEach(el => {
                  ;
                  Object.keys(propertiesToApply).forEach(prop => {
                    const value = window.getComputedStyle(el).getPropertyValue(prop);
                    if (value) el.style.setProperty(prop, value);
                  });
                });
              } catch (error) {
                console.warn(`Skipping invalid selector: '${selector}'`, error);
              }
            });
            target.remove();
            break;
          case 'tag':
            const spacer = '\u0020\u0020\u0020\u0020'
            const cssRules = (obj) => Object.entries(obj).map(([prop, value]) => `${prop}: ${value}`).join(`;\n${spacer}`)
            const fmtdCSS = Object.entries(source)
              .map(([selector, rules]) =>
                // `${selector === 'root' ? ':' : '.'}${selector.includes(',') ? selector.split(', ').join(',\n') : selector} {\n${spacer}${cssRules(rules)};\n}`)
                `${selector.includes(',') ? selector.split(', ').join(',\n') : selector} {\n${spacer}${cssRules(rules)};\n}`)
              .join('\n')
            const innerHTML = policy.createHTML(`\n${fmtdCSS}`);
            if (target) {
              if (update) return target.innerHTML += innerHTML;
              else return target.innerHTML = innerHTML;
            }
            return innerHTML;
          case 'virtual':
            Object.entries(source).forEach(([selector, declarations]) => {
              const cssText = Object.entries(declarations)
                .map(([prop, value]) => `${prop}:${value}`)
                .join(';');
              try {
                target.insertRule(`${selector}{${cssText}}`, target.cssRules.length);
              } catch (e) {
                console.warn(`Invalid rule for selector "${selector}":`, e);
              }
            });
            break;
          default:
            console.log('Invalid type. Use "inline", "tag", or "virtual".');
            break

        };
      }
      const headerStyles = {
        height: 70,
        width: 135,
        titleFontSize: 24,
        headerSize: {
          rank: 26,
          get title() { return headerStyles.width - 10 - this.rank }
        }
      };
      const style = document.head.appendChild((() => {
        const style = document.createElement('style');
        return style;
      })());
      const sheet = style.sheet
      const rules = {
        '.mceText': { 'font-family': 'DM Sans' },
        '.copy-button-container': { width: '100%' },
        '.copy-html-button': { margin: '1rem auto', display: 'block' },
        '.custom-styles': {
          height: '350px',
          display: 'grid',
          // 'grid-template-columns': '12fr 3fr 5fr',
          'grid-template-columns': '3fr 1fr',
          'user-select': 'none',
          'column-gap': '2rem'
        },
        '.custom-styles, .custom-styles *': { 'box-sizing': 'border-box', padding: '0', margin: '0' },
        '.multi-select': { display: 'grid', 'text-align': 'center' },
        '.card-checkbox-container': { width: '100%' },
        '.card-checkbox-label': {
          display: 'grid',
          width: '100%',
          height: '100%',
          'place-items': 'center'
        },
        '.card-checkbox': { display: 'none' },
        '.shows-column': { width: '100%', margin: '0 auto', 'min-width': '250px' },
        '.shows-grid': { width: '100%', height: '100%', 'grid-template-columns': 'repeat(4, 1fr)', 'grid-template-rows': 'repeat(5, 3fr) 2fr' },
        '.shows.card-checkbox-container': {
          border: '1px solid #999',
          'border-radius': '40px',
          'font-size': '1rem',
          'min-width': '0',
        },
        '.shows.card-checkbox-container label': {
          display: 'flex',
          'justify-content': 'space-evenly',
          padding: '0 0.25rem',
        },
        '.shows.card-checkbox-container label span': {
          'white-space': 'nowrap',
          overflow: 'hidden',
          'text-overflow': 'ellipsis',
        },
        '.shows-grid div:last-child': {
          'grid-area': 'auto / 2 / auto / 4'
        },
        '.shows.card-checkbox-container.checked': {
          'background-color': '#013f8c',
          color: '#fff'
        },
        '.mods-sections-column': {
          width: '100%',
          'min-width': '180px',
          display: 'flex',
          'flex-direction': 'column',
          margin: '0 auto'
        },
        '.sections-part': {
          'height': '100%'
        },
        '.sections-grid': {
          width: '100%',
          'grid-template-columns': 'repeat(2, 1fr)',
          height: '100%'
        },
        '.sections-grid div:first-child, .sections-grid div:nth-child(2)': {
          'grid-area': 'span 1 / span 2'
        },
        '.sections.card-checkbox-container': {
          border: '1px solid #000',
          'border-radius': '8px',
          margin: 'auto',
          padding: '5.75px 0',
          height: '100%'
        },
        '.sections.card-checkbox-container label': {
          margin: 'auto',
          padding: '5.75px 0',
          height: '100%'
        },
        '.sections.card-checkbox-container.checked': {
          'background-color': '#999',
          color: '#fff'
        },
        '#custom-styles:has(.none-checked) .sections.card-checkbox-container, #custom-styles:has(.all-checked) .sections.card-checkbox-container': {
          padding: '0'
        },
        '.button-container': {
          display: 'flex',
          'align-items': 'center'
        },
        '.button-container button': {
          margin: 'auto',
          'flex-shrink': '1',
          'flex-basis': '50%'
        },
        '.mods-part.visible': {
          display: 'flex',
          'flex-direction': 'column',
          gap: '0.5rem',
          'margin-top': '1rem'
        },
        '.mod': {
          width: '100%',
          display: 'flex',
          'flex-direction': 'column',
          'align-items': 'center',
          'justify-content': 'center'
        },
        '.mod.font': {
          display: 'flex'
        },
        '.mod.margin, .mod.font, .mod.color': {
          display: 'none'
        },
        '.mod.margin.enabled, .mod.color.enabled, .mod.font.enabled': {
          display: 'flex'
        },
        'input#color-input': {
          'margin-left': '1ch'
        },
        '.applied-column': {
          width: '100%',
          display: 'none',
          'flex-direction': 'column',
          'justify-content': 'space-around',
        },
        '.applied-section': {
          'min-height': '14rem',
          'list-style-position': 'inside',
        },
        '.applied-section ul': {
          'list-style-type': 'none',
        },
        '.applied-list-part, .applied-styles-part': {
          display: 'flex',
          'flex-direction': 'column',
          gap: '0.5rem',
          'align-items': 'center',
          'justify-content': 'center'
        },
        '.applied-list-option.disabled, .applied-style-item.disabled': {
          'display': 'none'
        },
        '.applied-list-select, .applied-style-info': {
          width: '100%',
        },
        '.applied-style-card': {
          display: 'none'
        },
        '.applied-style-card.selected': {
          display: 'flex',
          'flex-direction': 'column'
        }
      };
      createStyle({ source: rules, target: sheet, type: 'virtual' });

      const makeElem = ({ tag, ...props }, target = null) => {
        if (tag === 'iife') return;
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

      const clean = e => typeof e === 'string' ? e.trim().replace(/\n* +/g, '_') : e.textContent.trim().replace(/\n* +/g, ' ');

      const cardsInfo = {};

      const styleTag = {
        '.merch-cards *, .merch-cards *::before, .merch-cards *::after': { 'box-sizing': 'border-box', margin: '0', padding: '0', border: '0' },
        '.merch-cards, .card-info': { 'border-spacing': '0', 'border-collapse': 'collapse' },
        '.card-header': { display: 'block', 'background-color': '#013f8c', color: '#ffffff', padding: '0 4px' },
        '.merch-cards': { margin: '12px auto 0', 'text-align': 'center', 'table-layout': 'fixed', width: '100%' },
        '.merch-card': { display: 'inline-table', width: `${headerStyles.width}px`, 'min-height': '192px', margin: '12px', 'background-color': '#ffffff' },
        '.card-info': { border: '1px solid #dddddd', 'table-layout': 'fixed', 'width': '100%' },
        '.content-rank': { 'font-size': '20px' },
        '.content-title': { 'font-size': `${headerStyles.titleFontSize}px` },
        '.content-title div': { display: 'inline-flex' },
        '.card-body': { 'text-align': 'center' },
        '.content-other': { display: 'inline-block', 'min-width': '48%', margin: '4px 0' },
        '.content-title-impressions': { width: '100%' },
        '.span-key': { 'font-size': '12px' },
        '.span-value': { 'font-weight': 'bold' },
        '.span-container': { height: '100%', },
        '.lifetime': { width: '100%', color: '#999' }
      };

      const updateStyles = (card, title) => {
        if (typeof title === 'string') {
          const container = makeElem({
            tag: 'div', classList: ['sizing-table', 'merch-card'], children: [makeElem({
              tag: 'style', innerHTML: createStyle({ source: styleTag, type: 'tag' }),
            }),
            makeElem({
              tag: 'table', classList: ['card-info', 'mceText'], children: [makeElem({
                tag: 'thead', classList: ['card-header'], children: [makeElem({
                  tag: 'tr', children: [
                    makeElem({
                      tag: 'th', vAlign: 'top', align: 'left', width: headerStyles.headerSize.rank, classList: ['content-rank'], children: [makeElem({
                        tag: 'div', children: [makeElem({
                          tag: 'span', textContent: (parseInt(card.split('_')[0].replace(/num/, '')) + 1).toString()
                        })]
                      })]
                    }),
                    makeElem({
                      tag: 'th', vAlign: 'bottom', align: 'right', height: headerStyles.height, width: headerStyles.headerSize.title, classList: ['content-title'], children: [makeElem({
                        tag: 'div', children: [makeElem({
                          tag: 'span', textContent: title
                        })]
                      })],
                    })]
                })]
              })]
            })]
          }, document.body);
          let fontSize = headerStyles.titleFontSize;
          const table = container.childNodes[1];
          const titleElem = table.childNodes[0].childNodes[0].childNodes[1].childNodes[0].childNodes[0];
          const setFontSize = () => titleElem.style.fontSize = `${fontSize}px`;
          while (fontSize > 12) {
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
            if ((table.scrollWidth >= headerStyles.width || titleElem.getBoundingClientRect().width >= headerStyles.headerSize.title * 0.99) || numberOfLines(fontSize) >= 3) {
              if ((table.scrollWidth === headerStyles.width && titleElem.getBoundingClientRect().width < headerStyles.headerSize.title * 0.99) && numberOfLines(fontSize) <= 3) break;
              fontSize--;
              setFontSize();
            };
          };
          if (fontSize !== headerStyles.titleFontSize) {
            styleTag[`.merch-card.${card.replace(/ +/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')} .content-title`] = { 'font-size': `${fontSize}px` };
            createStyle({ source: styleTag, target: merchCards.childNodes[0], type: 'tag' });
          }
          document.body.removeChild(container);
        };
      };

      const readData = () => {
        const data = {};
        const hasRank = [...document.querySelectorAll('tr:not(:first-child) td:first-child')]
          .every((td, j) => /^\d+$/.test(clean(td)) && parseInt(clean(td), 10) === j + 1);
        document.querySelectorAll('tr:not(:first-child) td:first-child').forEach((td, i) => {
          const rowMap = new Map();
          td.parentNode.querySelectorAll('td').forEach((cell, ini) =>
            rowMap.set([
              ...new Map([
                ...document.querySelectorAll('tr:first-child td')
              ].map(td => [hasRank ? clean(td) === '' ? 'Rank' : clean(td) : clean(td), ''])).keys()
            ][ini], clean(cell)));
          data[`num${i}_${rowMap.get('Title').replace(/ /g, '-')}`] = Object.fromEntries(hasRank ? rowMap : [['Rank', `${i + 1}`], ...rowMap]);
        });

        return data;
      };

      const merchCards = makeElem({
        tag: 'div', classList: ['merch-cards-section'], children: [
          makeElem({
            tag: 'style', classList: ['merch-cards-style']
          }),
          makeElem({
            tag: 'table', classList: ['merch-cards', 'mceText'], children: [makeElem({
              tag: 'tbody', children: [makeElem({
                tag: 'tr', children: Object.entries(readData()).map(([ogKey, value]) => makeElem({
                  tag: 'td', classList: ['merch-card', `${ogKey.replace(/ +/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')}`], iife: (() => {
                    const key = ogKey.replace(/ +/g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
                    if (cardsInfo[key]) return;
                    cardsInfo[key] = { header: new Map(), body: new Map() };
                    Object.entries(value).forEach(([k, v]) => {
                      if (k === 'Rank' || k === 'Title') cardsInfo[key].header.set(k, v);
                      else cardsInfo[key].body.set(k, v);
                      cardsInfo[key].originalTitle = ogKey.replace(/-/g, ' ').replace(/^num.+_/, '');
                    });
                  })()
                }))
              })]
            })]
          })
        ]
      });

      merchCards.childNodes[1].childNodes[0].childNodes[0].childNodes.forEach(card => {
        if (!card.classList.contains('merch-card')) return;
        const cardInfo = cardsInfo[card.classList[1]];
        if (cardInfo) makeElem({
          tag: 'table', classList: ['card-info'], children: ['card-header', 'card-body'].map(section => makeElem({
            tag: section === 'card-header' ? 'thead' : 'tbody', classList: [section], children: [makeElem({
              tag: 'tr', children: [...cardInfo[`${section.replace(/card-/, '')}`]].map(([key, value]) => makeElem({
                tag: section === 'card-header' ? 'th' : 'td', vAlign: key === 'Title' ? 'bottom' : key === 'Rank' ? 'top' : '', align: key === 'Title' ? 'right' : key === 'Rank' ? 'left' : 'center', height: key === 'Title' && headerStyles.height, width: key === 'Title' ? headerStyles.headerSize.title : key === 'Rank' ? headerStyles.headerSize.rank : '', classList: (() => { if (key === 'Title') updateStyles(`${card.classList[1]}`, value); return (key !== 'Rank' && key !== 'Title') ? ['content-other', clean(`content-${key.replace(/ +/g, '-').toLowerCase()}`)] : [clean(`content-${key.toLowerCase()}`)] })(), children: (() => {
                  return [(section === 'card-body') && makeElem({
                    tag: 'div', classList: ['span-key'], children: [makeElem({
                      tag: 'span', textContent: (() => {
                        if (key.includes(' ')) {
                          let k = key.split(' ')[1];
                          if (key.includes('Lifetime')) k = `${k}*`
                          key = k;
                        }
                        return key
                      })()
                    })]
                  }),
                  makeElem({
                    tag: 'div', classList: [(key !== 'Rank' && key !== 'Title') ? 'span-value' : `span-${value.replace(/ +/g, '-').replace(/[^a-zA-Z0-9-_]/g, '')}`], children: [makeElem({
                      tag: 'span', textContent: value
                    })]
                  })]
                })()
              }))
            })]
          }))
        }, card);
      });

      if ([...merchCards.querySelectorAll('.span-key')].some(el => el.textContent.includes('*'))) {
        makeElem({
          tag: 'table', classList: ['lifetime'], children: [makeElem({
            tag: 'tr', children: [makeElem({
              tag: 'td', align: 'center', children: [makeElem({
                tag: 'span', textContent: '* indicates the lifetime value of the metric.'
              })]
            })]
          })]
        }, merchCards);
      };

      const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
          .then(() => console.log('Text copied to clipboard'))
          .catch(err => console.error('Failed to copy text: ', err));
      };

      const convertToInline = (copy) => {
        createStyle({ source: styleTag, target: merchCards.childNodes[0], type: 'inline' });
        if (copy) copyToClipboard(document.querySelector('.merch-cards-section').outerHTML);
      }

      const copyButton = makeElem({
        tag: 'div', classList: ['copy-button-container'], children: [makeElem({
          tag: 'button', classList: ['copy-html-button'], onclick() { convertToInline(true) }, textContent: 'Copy HTML to Clipboard',
        })]
      });

      const customStyles = () => {
        const showsMap = [...Object.entries(cardsInfo)];
        const checkedShows = () => [...document.querySelectorAll('.shows-grid .card-checkbox-container.shows label')].filter(l => l.parentNode.classList.contains('checked') && l.textContent !== 'All').map(l => [...l.parentNode.classList].find(c => /^num\d+_/.test(c)));
        const sectionsMap = ['Header', ...Object.values(cardsInfo)[0].body.keys()];
        const checkedSections = () => [...document.querySelectorAll('.sections-grid .card-checkbox-container.sections.checked label')].map(l => l.textContent.trim());

        const getMerchCardStyles = () => {
          const getStyles = () => {
            const merchSheet = [...document.styleSheets].find(
              s => s.ownerNode && s.ownerNode.classList && s.ownerNode.classList.contains('merch-cards-style')
            ).cssRules;

            if (!merchSheet) return null;
            const getRule = sel => [...merchSheet].find(r => r.selectorText === sel);
            const cardHeaderBg = getRule('.card-header')?.style.getPropertyValue('background-color');
            const merchCardsMargin = getRule('.merch-card')?.style.getPropertyValue('margin');
            const contentTitleFontSize = getRule('.content-title')?.style.getPropertyValue('font-size');
            const numRules = Object.fromEntries(
              showsMap.map(([key, value]) => [
                key,
                {
                  ...value,
                  style: {
                    titleSize: '',
                    headerColor: '',
                    impressionsColor: '',
                    playsColor: '',
                    hoursColor: '',
                    ctrColor: '',
                    lifetimeCTRColor: '',
                    pbrColor: '',
                    lifetimePBRColor: '',
                  }
                }
              ])
            );
            [...merchSheet]
              .filter(r => r.selectorText && /^\.merch-card\.num\d+_/.test(r.selectorText))
              .forEach(r => {
                const key = r.selectorText.split(' ')[0].replace(/\.merch-card\./, '')
                const fontSize = r.style.getPropertyValue('font-size');
                if (fontSize && numRules[key]) {
                  numRules[key].style.titleSize = fontSize
                };
              });
            return {
              cardHeaderBg,
              merchCardsMargin,
              contentTitleFontSize,
              numRules
            };
          };
          const obj = getStyles();
          const fontSize = document.querySelector('#font-size-range');
          const margin = document.querySelector('#margin-range');
          const color = document.querySelector('#color-input');
          Object.entries(obj.numRules).forEach(([card, key]) => {
            const styleEntries = Object.entries(key.style);
            const appliedCard = document.querySelector(`.applied-style-card.${card}`);
            const allEmpty = styleEntries.every(([k, v]) => v === '');
            const listOption = document.querySelector(`.applied-list-option.${card}`);
            if (allEmpty) {
              listOption.classList.add('disabled');
            } else {
              listOption.classList.remove('disabled');
              styleEntries.forEach(([k, v]) => {
                if (appliedCard) {
                  const li = appliedCard.querySelector(`.applied-style-item.${k}`)
                  if (v.length > 0) {
                    li.classList.remove('disabled');
                    li.querySelector(`.applied-style-value`).textContent = v;
                  }
                  else li.classList.add('disabled');
                }
              });
            }
          });

          const fontSizeLabel = document.querySelector('span#font-size-value');
          const marginLabel = document.querySelector('span#margin-value');
          // fontSizeLabel.textContent =
          // fontSize.value = obj.contentTitleFontSize;
          // marginLabel.textContent =
          // margin.value = `${parseInt(obj.merchCardsMargin.replace(/px/, '')) * 2}px`;
          return obj;
        };

        const setMerchCardStyles = (obj) => {
          const current = getMerchCardStyles();
          const actingOn = checkedShows().map(s => document.querySelector(`.merch-cards .${s}`))
          const sections = actingOn.flatMap(sho => checkedSections().map(sec => {
            if (obj.id.includes('color')) {
              if (sec.includes('Header')) return 'thead.card-header';
              return `.content-${sec.replace(/ /g, '-').toLowerCase()} .span-value span`;
            }
            if (obj.id.includes('font')) return 'th.content-title span';
            return '';
          }).flatMap(q => q !== '' ? `.${sho.classList.toString().replace(' ', '.')} ${q}` : sho));
          if (obj.id.includes('color')) {
            console.log({ actingOn, sections, current,/* newst,*/ obj })
            if (checkedSections().includes('Header')) sections.forEach(section => document.querySelectorAll(section).forEach(s => s.style.backgroundColor = obj.value));
            else sections.forEach(section => document.querySelectorAll(section).forEach(s => s.style.color = obj.value));
          }
          if (obj.id.includes('font')) sections.forEach(section => document.querySelectorAll(section).forEach(s => s.style.fontSize = `${obj.value}px`));
          if (obj.id.includes('margin')) document.querySelectorAll(section).forEach(s => s.style.margin = obj.value);
          getMerchCardStyles();
        };

        const updateMods = (obj = null) => {
          const showsState = document.querySelector('.shows-column').classList.value.replace(/^shows-column (.*)-checked/, '$1');
          const container = document.querySelector('.mods-part')
          const mods = document.querySelectorAll('.mod')
          container.classList.remove('visible');
          mods.forEach(mod => mod.classList.remove('enabled'));
          const modsMap = () => {
            if (checkedSections().length > 1 && checkedSections().includes('Header')) return {};
            if (['one', 'multiple', 'all'].includes(showsState) && checkedSections().length >= 1 && !checkedSections().includes('Header')) return { color: true };
            if (['one', 'all'].includes(showsState) && checkedSections().length === 1 && checkedSections().includes('Header')) return { color: true, font: true };
            if (showsState === 'multiple' && checkedSections().length === 1 && checkedSections().includes('Header')) return { color: true };
            if (showsState === 'all' && checkedSections().length === 0) return { margin: true };
            return {};
          }
          Object.values(modsMap()).find(v => v === true) ? container.classList.add('visible') : container.classList.remove('visible');
          mods.forEach(mod => modsMap()[mod.classList[1]] ? mod.classList.add('enabled') : mod.classList.remove('enabled'));
        }

        return {
          getMerchCardStyles,
          element: makeElem({
            tag: 'div',
            id: 'custom-styles',
            classList: ['custom-styles'],
            children: [
              makeElem({
                tag: 'div',
                classList: ['shows-column', 'none-checked'],
                children: [makeElem({
                  tag: 'div',
                  classList: ['shows-grid', 'multi-select'],
                  children: [...showsMap, ['All', { header: {}, body: {}, originalTitle: 'All' }]].map(key => makeElem({
                    tag: 'div',
                    classList: ['card-checkbox-container', 'shows', key[0]],
                    children: [makeElem({
                      tag: 'label',
                      classList: ['card-checkbox-label', 'shows'],
                      // textContent: key[1].originalTitle,
                      children: [
                        makeElem({
                          tag: 'span',
                          classList: ['card-checkbox-label-text'],
                          textContent: key[1].originalTitle
                        }),
                        makeElem({
                          tag: 'input',
                          type: 'checkbox',
                          classList: ['card-checkbox'],
                          onclick(e) {
                            if (this !== e.currentTarget) return;
                            const check = this.checked;
                            this.parentNode.parentNode.classList.toggle('checked', check);
                            const allButton = this.closest('.shows-grid').querySelector('.card-checkbox-container.shows.All');
                            const allShowElems = [...this.parentNode.parentNode.parentNode
                              .querySelectorAll('.card-checkbox-label.shows')];

                            if (this === allButton.querySelector('input')) {
                              allShowElems.filter(l => this.parentNode !== l)
                                .filter(l => check
                                  ? !l.parentNode.classList.contains('checked')
                                  : l.parentNode.classList.contains('checked'))
                                .forEach(l => {
                                  l.querySelector('input').checked = check
                                  l.parentNode.classList.toggle('checked', check);
                                });
                            }
                            const allChecked = (bool) => allShowElems
                              .filter(l => l.textContent !== 'All')
                              .every(l => bool ? l.parentNode.classList.contains('checked') : !l.parentNode.classList.contains('checked'));

                            const checkedCount = allShowElems.filter(l => l.textContent !== 'All' && l.parentNode.classList.contains('checked')).length;
                            const total = allShowElems.filter(l => l.textContent !== 'All').length;

                            const stateClass =
                              checkedCount === 0
                                ? 'none-checked'
                                : checkedCount === 1
                                  ? 'one-checked'
                                  : checkedCount === total
                                    ? 'all-checked'
                                    : checkedCount > 1
                                      ? 'multiple-checked'
                                      : '';

                            ['none-checked', 'one-checked', 'multiple-checked', 'all-checked'].forEach(cls =>
                              this.closest('.shows-column').classList.toggle(cls, stateClass === cls)
                            );
                            updateMods();
                            allButton.classList.toggle('checked', allChecked(true));
                            allButton.querySelector('input').checked = allChecked(true);
                          }
                        })]
                    })]
                  }))
                })]
              }),
              makeElem({
                tag: 'div',
                classList: ['mods-sections-column'],
                children: [
                  makeElem({
                    tag: 'div',
                    classList: ['sections-part'],
                    children: [makeElem({
                      tag: 'div',
                      classList: ['sections-grid', 'multi-select'],
                      children: sectionsMap.map(key => makeElem({
                        id: `edit-${key.includes('Lifetime') ? key.replace(/ /g, '') : key.includes(' ') ? key.split(' ')[1] : key}`,
                        tag: 'div',
                        classList: ['card-checkbox-container', 'sections'],
                        children: [makeElem({
                          tag: 'label',
                          classList: ['card-checkbox-label', 'sections-label', `${key.includes('Lifetime') ? key.split(' ').join('') : key.includes(' ') ? key.split(' ')[1] : key}`],
                          textContent: key.includes('Lifetime') ? key : key.includes(' ') ? key.split(' ')[1] : key,
                          children: [makeElem({
                            tag: 'input',
                            type: 'checkbox',
                            classList: ['card-checkbox'],
                            onclick() {
                              const check = this.checked
                              this.parentNode.parentNode.classList.toggle('checked', check);
                              updateMods();
                            },
                          })]
                        })]
                      }))
                    })],
                  }),
                  makeElem({
                    tag: 'div',
                    classList: ['mods-part'],
                    children: [
                      makeElem({
                        tag: 'div',
                        classList: ['mod', 'color'],
                        children: [
                          makeElem({
                            tag: 'label',
                            textContent: 'Color:',
                            children: [makeElem({
                              tag: 'input',
                              type: 'color',
                              id: 'color-input',
                              value: '#013f8c',
                              oninput(e) { setMerchCardStyles(this); }
                            })]
                          }),
                        ]
                      }),
                      makeElem({
                        tag: 'div',
                        classList: ['mod', 'font'],
                        children: [
                          makeElem({
                            tag: 'label',
                            textContent: 'Font Size',
                          }),
                          makeElem({
                            tag: 'div',
                            children: [makeElem({
                              tag: 'input',
                              type: 'range',
                              id: 'font-size-range',
                              min: 10,
                              max: 32,
                              step: 1,
                              value: 22,
                              oninput(e) { setMerchCardStyles(this); }
                            })]
                          })
                        ]
                      }),
                      makeElem({
                        tag: 'div',
                        classList: ['mod', 'margin'],
                        children: [
                          makeElem({
                            tag: 'label',
                            textContent: 'Card Margin',
                          }),
                          makeElem({
                            tag: 'div',
                            children: [makeElem({
                              tag: 'input',
                              type: 'range',
                              id: 'margin-range',
                              min: 0,
                              max: 40,
                              step: 2,
                              value: 24,
                              oninput(e) { setMerchCardStyles(this); }
                            })]
                          })]
                      })
                    ]
                  })
                ]
              }),
              makeElem({
                tag: 'div',
                classList: ['applied-column'],
                children: [
                  makeElem({
                    tag: 'div',
                    classList: ['button-container'],
                    children: [makeElem({
                      tag: 'button',
                      textContent: 'Apply',
                      onclick() { console.log('Apply button clicked'); }
                    })]
                  }),
                  makeElem({
                    tag: 'div',
                    classList: ['applied-section'],
                    children: [makeElem({
                      tag: 'div',
                      classList: ['applied-list-part'],
                      children: [
                        makeElem({
                          tag: 'div',
                          classList: ['applied-list-header'],
                          textContent: 'Applied Styles'
                        }),
                        makeElem({
                          tag: 'select',
                          classList: ['applied-list-select'],
                          children: [['Base', { header: {}, body: {}, originalTitle: 'Base' }], ...showsMap].map(([key, value]) => makeElem({
                            tag: 'option',
                            classList: ['applied-list-option', key, key !== 'Base' ? 'disabled' : ''],
                            textContent: value.originalTitle,
                          })),
                          onchange(e) {
                            this.closest('.applied-column').querySelectorAll('.applied-style-card').forEach(show => {
                              show.classList.toggle('selected', show.classList.contains(this[e.target.selectedIndex].classList[1]));
                            });
                          }
                        })
                      ],
                    }),
                    makeElem({
                      tag: 'div',
                      classList: ['applied-styles-part'],
                      children: [
                        makeElem({
                          tag: 'div',
                          classList: ['applied-style-info'],
                          children: [['Base', { header: {}, body: {}, originalTitle: 'Base' }], ...showsMap].map(([key, value]) => makeElem({
                            tag: 'div',
                            classList: ['applied-style-card', key, key === 'Base' ? 'selected' : ''],
                            children: [
                              makeElem({
                                tag: 'ul',
                                classList: ['applied-style-data'],
                                children: (() => {
                                  if (key === 'Base') return ['Header Color', 'Card Margin'].map(k => makeElem({
                                    tag: 'li',
                                    classList: ['applied-style-item', k.replace(' ', '-')],
                                    textContent: `${k}:`,
                                    children: [makeElem({
                                      tag: 'span',
                                      classList: ['applied-style-value'],
                                      textContent: k.includes('Color') ? '#013f8c' : '12'
                                    })]
                                  }))
                                  return ['Title', ...sectionsMap].map(k => {
                                    const ktoKey = () => {
                                      if (k === 'Title') return ['Title Font Size:', 'titleSize'];
                                      if (k.includes('Lifetime')) return [`${k} Color:`, `${k.split(' ').map((k, i) => i === 0 ? k.toLowerCase() : k.toUpperCase()).join('')}Color`];
                                      if (k.includes(' ')) return [`${k.split(' ')[1]} Color:`, `${k.split(' ')[1].toLowerCase()}Color`];
                                      return [`${k} Color:`, `${k.toLowerCase()}Color`];
                                    }
                                    return makeElem({
                                      tag: 'li',
                                      classList: ['applied-style-item', ktoKey()[1], 'disabled'],
                                      textContent: ktoKey()[0],
                                      children: [makeElem({
                                        tag: 'span',
                                        classList: ['applied-style-value'],
                                        textContent: ktoKey()[0].includes('Color') ? '#013f8c' : '12'
                                      })]
                                    })
                                  })
                                })()
                              })
                            ]
                          }))
                        })
                      ]
                    })]
                  })
                ]
              })
            ]
          })
        }
      };

      const generatePage = (...elems) => {
        document.querySelector('table').remove();
        elems.forEach(elem => document.body.appendChild(elem));
      };

      Object.assign(window, {
        iLikeBeingDifficult: () => { convertToInline(true) }
      });

      // generatePage(copyButton, merchCards);
      generatePage(customStyles().element, copyButton, merchCards);

      console.log(customStyles().getMerchCardStyles());

      console.log(
        "%c🚨 Heads up!%c\n\n%cThis page is designed to use the 'Copy HTML to Clipboard' button.%c\n\nIf you copy the HTML above, it may not look right everywhere. Use the button for perfect results!\n\n%cIf you insist on copying manually, first run %ciLikeBeingDifficult()%c below, or I can\'t guarantee email compatibility.",
        "color: #fff; background: #1a458c; font-size: 2em; font-weight: bold; padding: 10px 18px 6px 12px; border-radius: 12px 12px 0 0; display: block; font-family: 'DM Sans', sans-serif;",
        "",
        "color: #1a458c; font-size: 1.2em; font-weight: bold; font-family: 'DM Sans', sans-serif;",
        "color: #222; font-size: 1em; font-family: 'DM Sans', sans-serif;",
        "color: #888; font-size: 1em; font-family: 'DM Sans', monospace;",
        "color: #fff; background: #1a458c; font-weight: bold; padding: 2px 8px; border-radius: 4px; font-family: monospace;",
        "color: #888; font-size: 1em; font-family: 'DM Sans', monospace;"
      );
    })();
  })();
};

import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

import './App.css';

const data = [
  {
    id: 0,
    title: "Nobody's Love",
    images: {
      preview: ['img/6.avif', 'img/7.avif', 'img/8.avif', 'img/9.avif'],
      remaining: ['img/27.avif', 'img/26.avif', 'img/25.avif', 'img/24.avif']
    }
  },
  {
    id: 1,
    title: 'Good Wings',
    images: {
      preview: [
        'img/1.avif',
        'img/2.avif',
        'img/3.avif',
        'img/4.avif',
        'img/5.avif'
      ],
      remaining: ['img/30.avif', 'img/29.avif', 'img/28.avif']
    }
  }
];

const Row = ({ title, images, id }) => {
  const ref = useRef();
  const mouseenterTimeline = useRef();

  const [isOpen, setOpen] = useState(false);
  const [isAnimating, setAnimating] = useState(false);
  const [refs, setRefs] = useState({});

  // this.DOM.el = DOM_el;
  // this.previewItem = new PreviewItem(DOM_previewItem);
  // this.DOM.titleWrap = this.DOM.el.querySelector('.cell__title');
  // this.DOM.title = this.DOM.titleWrap.querySelector('.oh__inner');
  // this.DOM.imagesWrap = this.DOM.el.querySelector('.cell--images');
  // this.DOM.images = [...this.DOM.imagesWrap.querySelectorAll('.cell__img')];

  useEffect(() => {
    if (ref.current) {
      const previewItems = [
        ...document.querySelectorAll('.preview > .preview__item')
      ];

      setRefs({
        el: ref.current,
        titleWrap: ref.current.querySelector('.cell__title'),
        title: ref.current.querySelector('.oh__inner'),
        imagesWrap: ref.current.querySelector('.cell--images'),
        images: [...ref.current.querySelectorAll('.cell__img')],
        cover: document.querySelector('.cover'),

        previewItem: {
          el: previewItems[id],
          title: previewItems[id].querySelector(
            '.preview__item-title > .oh__inner'
          ),
          grid: previewItems[id].querySelector('.grid'),
          images: [
            ...previewItems[id]
              .querySelector('.grid')
              .querySelectorAll('.cell__img')
          ]
        }
      });
    }
  }, [id]);

  useEffect(() => {
    const handle = () => {
      if (isAnimating) return;

      setAnimating(true);
      setOpen(false);

      const row = refs.el;

      gsap
        .timeline({
          defaults: { duration: 0.5, ease: 'power4.inOut' },
          onStart: () => document.querySelector('#body').classList.remove('oh'),
          onComplete: () => {
            refs.el.classList.remove('row--current');
            refs.previewItem.el.classList.remove('preview__item--current');
            setAnimating(false);
          }
        })
        .addLabel('start', 0)
        .to(
          [refs.images, refs.previewItem.images],
          {
            scale: 0,
            opacity: 0,
            stagger: 0.04,
            onComplete: () => refs.imagesWrap.prepend(...refs.images)
          },
          0
        )
        .to(
          refs.previewItem.title,
          {
            duration: 0.6,
            yPercent: 100
          },
          'start'
        )
        .to(
          document.querySelector('.preview > .preview__close'),
          {
            opacity: 0
          },
          'start'
        )
        // animate cover out
        .to(
          refs.cover,
          {
            ease: 'power4',
            height: 0,
            top:
              refs.el.getBoundingClientRect()['top'] + refs.el.offsetHeight / 2
          },
          'start+=0.4'
        )
        // fade out cover
        .to(
          refs.cover,
          {
            duration: 0.3,
            opacity: 0
          },
          'start+=0.9'
        )
        // animate all the titles in
        .to(
          [...document.querySelectorAll('.row .oh__inner')],
          {
            yPercent: 0,
            stagger: {
              each: 0.03,
              grid: 'auto',
              from: currentRow
            }
          },
          'start+=0.4'
        );
    };

    document
      .querySelector('.preview > .preview__close')
      .addEventListener('click', handle);
    return () =>
      document
        .querySelector('.preview > .preview__close')
        .removeEventListener('click', handle);
  }, []);

  return (
    <div
      ref={ref}
      onMouseEnter={e => {
        if (isOpen) return;

        gsap.killTweensOf([refs.images, refs.title]);

        mouseenterTimeline.current = gsap
          .timeline()
          .addLabel('start', 0)
          .to(
            refs.images,
            {
              duration: 0.4,
              ease: 'power3',
              startAt: {
                scale: 0.8,
                xPercent: 20
              },
              scale: 1,
              xPercent: 0,
              opacity: 1,
              stagger: -0.035
            },
            'start'
          )
          .set(refs.title, { transformOrigin: '0% 50%' }, 'start')
          .to(
            refs.title,
            {
              duration: 0.1,
              ease: 'power1.in',
              yPercent: -100,
              onComplete: () =>
                refs.titleWrap.classList.add('cell__title--switch')
            },
            'start'
          )
          .to(
            refs.title,
            {
              duration: 0.5,
              ease: 'expo',
              startAt: {
                yPercent: 100,
                rotation: 15
              },
              yPercent: 0,
              rotation: 0
            },
            'start+=0.1'
          );
      }}
      onMouseLeave={e => {
        if (isOpen) return;

        gsap.killTweensOf([refs.images, refs.title]);

        gsap
          .timeline()
          .addLabel('start')
          .to(
            refs.images,
            {
              duration: 0.4,
              ease: 'power4',
              opacity: 0,
              scale: 0.8
            },
            'start'
          )
          .to(
            refs.title,
            {
              duration: 0.1,
              ease: 'power1.in',
              yPercent: -100,
              onComplete: () =>
                refs.titleWrap.classList.remove('cell__title--switch')
            },
            'start'
          )
          .to(
            refs.title,
            {
              duration: 0.5,
              ease: 'expo',
              startAt: {
                yPercent: 100,
                rotation: 15
              },
              yPercent: 0,
              rotation: 0
            },
            'start+=0.1'
          );
      }}
      onClick={() => {
        if (isAnimating) return;

        setAnimating(true);
        setOpen(true);

        const currentRow = refs.el;

        gsap.killTweensOf([
          refs.cover,
          [...document.querySelectorAll('.row .oh__inner')]
        ]);

        gsap
          .timeline({
            onStart: () => {
              document.querySelector('#body').classList.add('oh');
              refs.el.classList.add('row--current');
              refs.previewItem.el.classList.add('preview__item--current');

              gsap.set(refs.previewItem.images, { opacity: 0 });

              // set cover to be on top of the row and then animate it to cover the whole page
              gsap.set(refs.cover, {
                height: refs.el.offsetHeight - 1, // minus border width
                top: refs.el.getBoundingClientRect()['top'],
                opacity: 1
              });

              gsap.set(refs.previewItem.title, {
                yPercent: -100,
                rotation: 15,
                transformOrigin: '100% 50%'
              });

              document
                .querySelector('.preview > .preview__close')
                .classList.add('preview__close--show');
            },
            onComplete: () => setAnimating(false)
          })
          .addLabel('start', 0)
          .to(
            refs.cover,
            {
              duration: 0.9,
              ease: 'power4.inOut',
              height: window.innerHeight,
              top: 0
            },
            'start'
          )
          // animate all the titles out
          .to(
            [...document.querySelectorAll('.row .oh__inner')],
            {
              duration: 0.5,
              ease: 'power4.inOut',
              yPercent: (_, target) => {
                return target.getBoundingClientRect()['top'] >
                  refs.el.getBoundingClientRect()['top']
                  ? 100
                  : -100;
              },
              rotation: 0
            },
            'start'
          )
          .add(() => {
            mouseenterTimeline.current.progress(1, false);

            const flipstate = Flip.getState(refs.images, {
              simple: true
            });

            refs.previewItem.grid.prepend(...refs.images);

            Flip.from(flipstate, {
              duration: 0.9,
              ease: 'power4.inOut',
              //absoluteOnLeave: true,
              stagger: 0.04
            }).to(
              refs.previewItem.images,
              {
                duration: 0.9,
                ease: 'power4.inOut',
                startAt: {
                  scale: 0,
                  yPercent: () => gsap.utils.random(0, 200)
                },
                scale: 1,
                opacity: 1,
                yPercent: 0,
                stagger: 0.04
              },
              0.04 * refs.images.length
            );
          }, 'start')
          .to(
            refs.previewItem.title,
            {
              duration: 1,
              ease: 'power4.inOut',
              yPercent: 0,
              rotation: 0,
              onComplete: () =>
                refs.titleWrap.classList.remove('cell__title--switch')
            },
            'start'
          )
          .to(
            document.querySelector('.preview > .preview__close'),
            {
              duration: 1,
              ease: 'power4.inOut',
              opacity: 1
            },
            'start'
          );
      }}
      className="row"
    >
      <div className="cell cell--text">
        <h2 className="cell__title oh">
          <span className="oh__inner">{title}</span>
        </h2>
      </div>
      <div className="cell cell--images">
        {images.preview.map(image => (
          <div key={'cover-row-image-' + image} className="cell__img">
            <div
              className="cell__img-inner"
              style={{ backgroundImage: 'url(' + image + ')' }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  return (
    <div id="body" className="loading">
      <main>
        <section className="content">
          <div className="cover"></div>

          {data.map(props => (
            <Row key={'cover-row-' + props.id} {...props} />
          ))}
        </section>

        <section className="preview">
          <button className="preview__close unbutton">&#9587;</button>

          {data.map(({ id, title, images }) => (
            <div className="preview__item" key={'preview-item-' + id}>
              <h2 className="preview__item-title oh">
                <span className="oh__inner">{title}</span>
              </h2>

              <div className="grid">
                {images.remaining.map(image => (
                  <div
                    key={'preview-item-image-' + image}
                    className="cell__img"
                  >
                    <div
                      className="cell__img-inner"
                      style={{ backgroundImage: 'url(' + image + ')' }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <script type="module" src="js/index.js"></script>
    </div>
  );
}

export default App;

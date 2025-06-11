import React from 'react';

const Loader = () => {
  return (
    <>
      <style>
        {`
          /* Votre CSS pour le loader, avec la couleur modifiée */
          .loader {
            width: 60px;
            aspect-ratio: 2;
            /* J'ai changé #000 en #3A4F8A (le bleu foncé de vos boutons) */
            --_g: no-repeat radial-gradient(circle closest-side, #3A4F8A 90%, #0000);
            background: 
              var(--_g) 0%   50%,
              var(--_g) 50%  50%,
              var(--_g) 100% 50%;
            background-size: calc(100%/3) 50%;
            animation: l3 1s infinite linear;
          }

          @keyframes l3 {
              20%{background-position:0%   0%, 50%  50%,100%  50%}
              40%{background-position:0% 100%, 50%   0%,100%  50%}
              60%{background-position:0%  50%, 50% 100%,100%   0%}
              80%{background-position:0%  50%, 50%  50%,100% 100%}
          }
          
          /* Un conteneur pour centrer facilement le loader */
          .loader-container {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 40px; /* Espace autour du loader */
            width: 100%;
            box-sizing: border-box;
          }
        `}
      </style>
      <div className="loader-container">
        <div className="loader"></div>
      </div>
    </>
  );
};

export default Loader;
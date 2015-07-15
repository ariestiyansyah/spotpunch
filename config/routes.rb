Rails.application.routes.draw do
  
  root 'home#index'

  resources :administrators, only: [:index]  do
    get 'users'                       => 'administrators#users',                on: :collection
    get 'malls'                       => 'administrators#malls',                on: :collection
    get 'stores'                      => 'administrators#stores',               on: :collection
    get 'products'                    => 'administrators#products',             on: :collection
    get 'promotions'                  => 'administrators#promotions',           on: :collection
    get 'setting'                     => 'administrators#setting',              on: :collection
    get 'import'                      => 'administrators#import',               on: :collection
    collection { post :import }
  end

end

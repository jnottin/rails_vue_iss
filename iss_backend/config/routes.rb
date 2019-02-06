Rails.application.routes.draw do
  # post "/addTimePass", to: "pass_location_times#create"
  match "/addTimePass" => "pass_location_times#create", :via => :post, :as => :create_timePass

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'homepage#index'

end

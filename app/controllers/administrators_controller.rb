class AdministratorsController < ApplicationController
  before_action :authenticate_user!
  before_filter :modal_search_exist
  
  layout "administrator"

  def index
    
  end

  def users
    
  end

  def malls
    @malls = Mall.all
  end

  def stores
    
  end

  def products
    
  end

  def brands
    
  end

  def promotions
    
  end

  def setting
    
  end

  def import
  end
  
end

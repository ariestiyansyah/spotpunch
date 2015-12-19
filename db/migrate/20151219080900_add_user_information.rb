class AddUserInformation < ActiveRecord::Migration
  def change
    add_column :users,    :phone,     :string
    add_column :users,    :location,  :string
    add_column :users,    :biodata,   :text
  end
end

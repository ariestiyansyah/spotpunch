class AddDescStores < ActiveRecord::Migration
  def change
    add_column :stores,    :kind,     :string
    add_column :stores,    :desc,     :text
    add_column :stores,    :area,     :string
    add_column :stores,    :city,     :string
    add_column :stores,    :address,  :string
    add_column :stores,    :phone,  :string
  end
end
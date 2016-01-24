class AddDescriptionMall < ActiveRecord::Migration
  def change
    add_column :malls,  :description, :text
    add_column :malls,  :phone,       :string
  end
end

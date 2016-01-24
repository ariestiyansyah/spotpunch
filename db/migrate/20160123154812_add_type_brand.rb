class AddTypeBrand < ActiveRecord::Migration
  def change
    add_column :brands,    :kind,     :string
  end
end

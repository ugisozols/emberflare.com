class AddSlugToEntries < ActiveRecord::Migration
  def change
    add_column :entries, :slug, :string
    add_index :entries, :slug, :unique => true
  end
end

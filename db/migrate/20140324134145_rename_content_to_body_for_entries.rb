class RenameContentToBodyForEntries < ActiveRecord::Migration
  def change
    rename_column :entries, :content, :body
  end
end

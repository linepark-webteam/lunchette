<?php
//子テーマ用関数
if ( !defined( 'ABSPATH' ) ) exit;

//子テーマ用のビジュアルエディタースタイルを適用
add_editor_style();

//以下に子テーマ用の関数を書く
add_filter('theme_description', 'remove_theme_description');

function remove_theme_description() {
    return '';
}
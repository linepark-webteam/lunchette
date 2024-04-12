<?php
/**
 * Lunchette WordPress Theme
 * @author: LiNE PARK WebTeam
 * @link: https://www.linepark.co.jp/
 */
if ( !defined( 'ABSPATH' ) ) exit; ?>
<?php get_header(); ?>

<?php
////////////////////////////
//一覧表示
///////////////////////
if (!is_user_agent_live_writer()) {
  //通常表示
  cocoon_template_part('tmp/list');
} else {
  //ブログエディターLive Writerでテーマ取得の際
  cocoon_template_part('tmp/live-writer');
}
?>

<?php get_footer(); ?>

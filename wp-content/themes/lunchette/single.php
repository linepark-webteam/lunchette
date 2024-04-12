<?php //通常ページとAMPページの切り分け
/**
 * Lunchette WordPress Theme
 * @author: LiNE PARK WebTeam
 * @link: https://www.linepark.co.jp/
 */
if ( !defined( 'ABSPATH' ) ) exit;

if (!is_amp()) {
   get_header();
 } else {
   cocoon_template_part('tmp/amp-header');
 }
?>

<?php //投稿ページ内容
cocoon_template_part('tmp/single-contents'); ?>

<?php get_footer(); ?>

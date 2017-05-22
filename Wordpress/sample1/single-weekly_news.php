<?php

get_header();
$cb_post_id = $post->ID;
$cb_featured_image_style_override_onoff = ot_get_option('cb_post_style_override_onoff', 'off');
$cb_featured_image_style_override_style = ot_get_option('cb_post_style_override', 'standard');
$cb_post_format = get_post_format();
$cb_featured_image_style = get_post_meta( $cb_post_id, 'cb_featured_image_style', true );
$cb_featured_image_style_override_post_onoff = get_post_meta( $cb_post_id, 'cb_featured_image_style_override', true );
$cb_sidebar_position = cb_get_sidebar_setting();
$cb_featured_image_style_cache = $cb_content_class = $cb_fis_size_output = NULL;
$cb_review_checkbox = get_post_meta($cb_post_id, 'cb_review_checkbox', true );

if ( ( $cb_featured_image_style_override_onoff == 'on' ) && ( $cb_featured_image_style_override_post_onoff != 'on') ) {
   $cb_featured_image_style = $cb_featured_image_style_override_style;
}

if ( $cb_featured_image_style == NULL ) {
     $cb_featured_image_style = 'standard';
}
if ( $cb_featured_image_style == 'standard-uncrop' ) {
	$cb_featured_image_style = 'standard';
}

if ( ( $cb_post_format == 'video') || ( $cb_post_format == 'audio') ) {
	$cb_featured_image_style_cache = $cb_featured_image_style;
	$cb_featured_image_style = $cb_post_format;
}
if ( $cb_post_format == 'gallery' ) {
	$cb_gallery_post_images = get_post_meta( $cb_post_id, 'cb_gallery_post_images', true );
        
    if ( $cb_gallery_post_images != NULL ) {

		$cb_featured_image_style = $cb_post_format;
	}
}

$cb_fis_size = cb_get_fis_size($cb_post_id);

if ( ( ot_get_option( 'cb_postload_onoff', 'off' ) == 'off' ) && ( $cb_fis_size == 'box' ) ) { 
	$cb_content_class = 'wrap '; 
}
?>

<div id="cb-content" class="<?php echo esc_attr($cb_content_class); ?>clearfix">
	
	<div class="cb-entire-post cb-first-alp clearfix<?php echo esc_attr( $cb_fis_size_output ); ?>"<?php cb_alp( $cb_post_id ); ?>>

		<?php if ( ( $cb_featured_image_style != 'off' ) && ( $cb_featured_image_style_cache != 'off' ) && ( $cb_featured_image_style != 'standard' ) && ( $cb_featured_image_style_cache != 'standard' )  ) { do_shortcode ( cb_featured_image_style( $cb_featured_image_style, $post ) ); } ?>
                			
		<div class="cb-post-wrap cb-wrap-pad wrap clearfix<?php echo esc_attr( cb_get_post_sidebar_position( $cb_post_id ) ); echo esc_attr( cb_get_singular_fs( $cb_post_id ) ); ?>">

			<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>

					<?php cb_schema_meta( $cb_post_id ); ?>

					<div class="cb-main clearfix">
                        
                        <?php //include (STYLESHEETPATH . '/polldaddy.php'); ?>

						<article id="post-<?php the_ID(); ?>" <?php post_class('clearfix WeeklyNews'); ?>>

							<?php if ( ( $cb_featured_image_style == 'off' ) || ( $cb_featured_image_style == 'standard' ) || ( $cb_featured_image_style_cache == 'standard' ) || ( $cb_featured_image_style_cache == 'off' )  ) { cb_featured_image_style( $cb_featured_image_style, $post ); }; ?>

							<section class="cb-entry-content clearfix" <?php  if ( ( $cb_review_checkbox == 'on' ) || ( $cb_review_checkbox == '1' ) ) { echo 'itemprop="reviewBody"'; } else { echo 'itemprop="articleBody"'; } ?>>

								<div class="single-weekly-news-content"><?php the_content(); ?></div>

								<?php // $standartNews = get_post_meta($post->ID, 'weekly_news', true); ?>

								<?php if( have_rows('weekly_news') ): ?>									
										<?php  while ( have_rows('weekly_news') ) : the_row(); ?>
											<?php if( get_row_layout() == 'standart_news' ): ?>
													<?php 																
														$title = get_sub_field('title');
														$desc = get_sub_field('desc');
														$linkName = ( !empty( get_sub_field('link-name') ) ) ? get_sub_field('link-name') : "Read More";
														$manual_image_toggle = get_sub_field('manual_image_toggle');
														$local_image = get_sub_field('local_image');
														$remote_image = get_sub_field('remote_image');
														$imageSrc = $remote_image['image-url'];
														if ( $manual_image_toggle && !empty( $local_image ) ) {
															$imageSrc = $local_image['sizes']['weekly-news'];
														}
														
														$url = $remote_image['url'];
													?>
													<div class="StandartNews">
														<?php if (!empty($imageSrc)): ?>
															<div class="StandartNews__image" style="background: url(<?php echo $imageSrc ?>) 0 0 no-repeat; background-size: cover; background-position:center;"></div>	
														<?php endif ?>												
														<div class="StandartNews__content">
															<div class="StandartNews__title">
																<?php echo $title ?>
															</div>
															<div class="StandartNews__desc">
																<?php echo $desc ?>
																<a class="StandartNews__readMore" href="<?php echo $url ?>" target="_blank"><?php echo $linkName ?></a>
															</div>
														</div>
												</div>										
											<?php elseif( get_row_layout() == 'video_news' ): ?>
												<?php 
													$title = get_sub_field('title');
													$desc = get_sub_field('desc');
													$video = get_sub_field('video');
													$video_link = get_sub_field('video', false);
													$link  = "Watch Here";
												 ?>
												<div class="VideoNews">
														<div class="VideoNews__video">
															<div class="VideoNews__oembed">
																<?php echo $video ?>	
															</div>														
														</div>
														<div class="VideoNews__content">
															<div class="VideoNews__title">
																<?php echo $title ?>
															</div>
															<div class="VideoNews__desc">
																<?php echo $desc ?>
																<a href="<?php echo $video_link ?>" class="VideoNews__readMore" target="_blank">
																	<?php echo $link ?>	
																</a>
															</div>
														</div>
												</div>
											<?php endif; ?>
										<?php endwhile; ?>
								<?php endif; ?>

								<?php wp_link_pages('before=<div class="cb-pagination clearfix">&after=</div>&next_or_number=number&pagelink=<span class="cb-page">%</span>'); ?>
								
							</section> <!-- end article section -->
							
							<footer class="cb-article-footer">
								<?php
									echo '<div class="share-and-tags">';
										if ( ot_get_option('cb_tags_onoff', 'on') != 'off' ) { the_tags('<p class="cb-tags cb-post-footer-block"> ', '', '</p>'); }
										echo cb_sharing_block( $post );
									echo '</div>';
									echo cb_post_footer_ad();
									if ( $post->post_type != 'attachment' ) { cb_previous_next_links(); }
									echo cb_about_author( $post );
									cb_related_posts(); 
									comments_template(); 
									
			                     ?>
							</footer> <!-- end article footer -->

						</article> <!-- end article -->						

					</div> <!-- end .cb-main -->

			<?php endwhile; ?>

			<?php endif; ?>

			<?php if ( ( $cb_sidebar_position != 'nosidebar' ) && ( $cb_sidebar_position != 'nosidebar-fw' ) ) { get_sidebar(); } ?>

		</div>

	</div>    	

</div> <!-- end #cb-content -->

<?php cb_alp_ldr(); ?>

<?php get_footer(); ?>
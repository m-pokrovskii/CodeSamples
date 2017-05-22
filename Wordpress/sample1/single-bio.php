<?php
	get_header();
	global $post;
	$rei_bioID = $post->ID;
?>

<div id="cb-content" class="Bio wrap cb-wrap-pad clearfix cb-fw-bs">

				<div class="cb-module-header cb-category-header">
						<h1 class="cb-module-title">Author Bio</h1>
				</div>
				
				<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
				
						<div class="rei-author-bio-container clearfix">
								<div class="rei-author-bio-avatar">
									<?php echo get_the_post_thumbnail($rei_bioID, 'thumbnail'); ?>
								</div>
								<div class="rei-author-bio-info">
										<div class="rei-author-bio-name"><h1><?php the_title(); ?></h1></div>
										<div class="rei-author-bio-details"><?php the_content(); ?></div>
										<div class="rei-author-bio-sociallinks">
											<?php
												$cb_author_email = get_post_field('wpcf-reibio_email', $rei_bioID);
												$cb_author_tw = get_post_field('wpcf-reibio_twitter', $rei_bioID);
												$cb_author_facebook = get_post_field('wpcf-reibio_facebook', $rei_bioID);
												$cb_author_instagram = get_post_field('wpcf-reibio_instagram', $rei_bioID);
												$cb_author_googleplus = get_post_field('wpcf-reibio_google_plus', $rei_bioID);
												$cb_author_www = get_post_field('wpcf-reibio_website', $rei_bioID); 
											?>
											<?php if ( ( $cb_author_email != NULL ) || ( $cb_author_www != NULL ) || ( $cb_author_tw != NULL ) || ( $cb_author_instagram != NULL ) || ( $cb_author_googleplus != NULL ) ): ?>
												<div class="cb-author-page-contact">												
													<?php 
														if ( $cb_author_email != NULL ) { echo '<a href="mailto:' . sanitize_email( $cb_author_email ) . '" class="cb-contact-icon cb-tip-bot" data-cb-tip="' . __('Email', 'cubell') . '"><i class="fa fa-envelope-o"></i></a>'; }
														if ( $cb_author_www != NULL ) { echo ' <a href="' . esc_url( $cb_author_www ) . '" target="_blank" class="cb-contact-icon cb-tip-bot" data-cb-tip="'. __('Website', 'cubell') . '"><i class="fa fa-link"></i></a> '; }
														if ( $cb_author_tw != NULL ) { echo ' <a href="//www.twitter.com/' . $cb_author_tw . '" target="_blank" class="cb-contact-icon cb-tip-bot" data-cb-tip="Twitter"><i class="fa fa-twitter"></i></a>'; }
														if ( $cb_author_facebook != NULL ) { echo ' <a href="'. $cb_author_facebook . '" target="_blank" class="cb-contact-icon cb-tip-bot" data-cb-tip="Facebook"><i class="fa fa-facebook"></i></a>'; }
														if ( $cb_author_googleplus != NULL ) { echo ' <a href="' . esc_url( $cb_author_googleplus ) . '" target="_blank" class="cb-contact-icon cb-tip-bot" data-cb-tip="Google+"><i class="fa fa-google-plus"></i></a>'; }
														if ( $cb_author_instagram != NULL ) { echo ' <a href="' . esc_url( $cb_author_instagram ) . '" target="_blank" class="cb-contact-icon cb-tip-bot" data-cb-tip="Instagram"><i class="fa fa-instagram"></i></a>'; }
													?>
												</div>
											<?php endif ?>
										</div>
								</div>
						</div>
						
						<div class="rei-author-storiesbytitle">Stories by <?php the_title(); ?>...</div>
												
				<?php endwhile; ?>
		<?php endif; ?>
		<?php
		$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;
		$author_posts_query = new WP_Query( array(
			'post_type'  => 'post',
			'meta_key'   => '_rei_bio',
			'meta_value' => $rei_bioID,
			'posts_per_page' => 12,
			'paged' => $paged
			) );
		?>
		<?php if ( $author_posts_query->have_posts() ) : ?>
		<div class="Bio__posts cb-main clearfix cb-module-block cb-blog-style-roll clearfix">
			<?php while ( $author_posts_query->have_posts() ) : $author_posts_query->the_post(); ?>
				<?php $cb_count++; ?>
				<article id="post-<?php the_ID(); ?>" <?php post_class( "cb-blog-style-b cb-module-a cb-article cb-article-row-2 cb-article-row cb-img-above-meta clearfix cb-separated cb-no-$cb_count" ); ?>>
						<div class="cb-mask cb-img-fw" <?php cb_img_bg_color( $post->ID ); ?>>
								<?php cb_thumbnail( '360', '240' ); ?>
								<?php cb_review_ext_box( $post->ID ); ?>
						</div>
						<div class="cb-meta clearfix">
								<h2 class="cb-post-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
								<?php cb_byline( $post->ID ); ?>
								<div class="cb-excerpt"><?php echo cb_clean_excerpt( 160 ); ?></div>
								<?php cb_post_meta( $post->ID ); ?>
						</div>
				</article>
				<?php if ( $cb_count == 3 ) { $cb_count = 0; } ?>
			<?php endwhile; ?>
		</div>
				<?php
				$cb_pagination = paginate_links( array(
					'base'     => str_replace( 99999, '%#%', esc_url( get_pagenum_link(99999) ) ),
					'format'   => '',
					'total'    => $author_posts_query->max_num_pages,
					'current'  => max( 1, $author_posts_query->query_vars['paged'] ),
					'mid_size' => 2,
					'prev_text' => '<i class="fa fa-long-arrow-left"></i>',
					'next_text' => '<i class="fa fa-long-arrow-right"></i>',
					'type' => 'list',
				) );

				echo '<nav class="cb-pagination clearfix">' . $cb_pagination . '</nav>';
				 ?>
		<?php else: ?>
			<h1>Nothing found</h1>
		<?php endif; ?>			
		<?php  wp_reset_postdata(); ?>
		
</div> <!-- end #cb-content -->

<?php get_footer(); ?>
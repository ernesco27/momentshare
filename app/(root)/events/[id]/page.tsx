import { ArrowLeft, Camera, Copy, Download, Share2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getEvent } from "@/lib/actions/event.action";
import handleError from "@/lib/handlers/error";
import { ErrorResponse, RouteParams } from "@/types/global";

const EventDetailsPage = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { data: event } = await getEvent({ eventId: id });

  const {
    title,
    description,
    expiryDate,
    loc,
    coverImage,
    qrCode,
    qrImage,
    eventUrl,
    startDate,
    maxUploadsPerAttendee,
  } = event!;

  const isExpired = event ? new Date(expiryDate) < new Date() : false;

  const handleShare = async () => {
    if (!event) return;

    // const uploadUrl = `${window.location.origin}/upload/${event.qr_code}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${event.title} - Photo Upload`,
          text: `Upload your photos to ${event.title}`,
          url: eventUrl,
        });
      } catch (error) {
        // User cancelled sharing
        return handleError(error as ErrorResponse);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(eventUrl);
        toast("Link copied to clipboard!");
      } catch (error) {
        toast("Failed to copy link to clipboard!");
        return handleError(error as ErrorResponse);
      }
    }
  };

  const handleDownloadQR = () => {
    if (!qrImage || !event) return;

    const link = document.createElement("a");
    link.download = `${title}-QR-Code.png`;
    link.href = eventUrl;
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{title}</h1>
              <p className="text-muted-foreground">
                QR Code for Photo Collection
              </p>
            </div>
          </div>

          {/* QR Code Card */}
          <Card className="shadow-elegant mb-6">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Scan to Upload Photos</span>
              </CardTitle>
              <CardDescription>
                {isExpired
                  ? "This event has expired and is no longer accepting uploads"
                  : "Attendees can scan this QR code to upload their photos instantly"}
              </CardDescription>
            </CardHeader>

            <CardContent className="text-center space-y-6">
              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-6 rounded-xl shadow-soft">
                  {qrImage && (
                    <Image
                      src={qrImage}
                      alt="QR Code for photo upload"
                      width={300}
                      height={300}
                      className="w-64 h-64"
                    />
                  )}
                </div>
              </div>

              {/* Upload URL */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Direct Link:</p>
                <div className="flex items-center space-x-2 bg-secondary/50 rounded-lg p-3">
                  <code className="flex-1 text-sm text-left break-all">
                    {eventUrl}
                  </code>
                  <Button
                    onClick={() => navigator.clipboard.writeText(eventUrl)}
                    size="sm"
                    variant="outline"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleShare}
                  className="flex-1 shadow-glow"
                  disabled={isExpired}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share with Attendees
                </Button>

                <Button
                  onClick={handleDownloadQR}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
              </div>

              {/* Instructions */}
              <div className="text-left bg-secondary/20 rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Instructions for Attendees:</h3>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open your phone&apos;s camera app</li>
                  <li>Point the camera at this QR code</li>
                  <li>Tap the notification that appears</li>
                  <li>Select photos/videos to upload</li>
                  <li>Your memories will be collected for the organizer!</li>
                </ol>
              </div>

              {/* Event Details */}
              <div className="text-left bg-card rounded-lg p-4 border">
                <h3 className="font-medium mb-2">Event Details:</h3>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>
                    <strong>Title:</strong> {title}
                  </p>
                  {description && (
                    <p>
                      <strong>Description:</strong> {description}
                    </p>
                  )}
                  <p>
                    <strong>Expires:</strong>{" "}
                    {new Date(expiryDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Status:</strong> {isExpired ? "Expired" : "Active"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;

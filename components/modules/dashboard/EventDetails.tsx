"use client";

import { format } from "date-fns";
import jsPDF from "jspdf";
import {
  ArrowLeft,
  Camera,
  Copy,
  Download,
  ImageIcon,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ROUTES from "@/constants/route";
import handleError from "@/lib/handlers/error";
import { ErrorResponse, GlobalEvent } from "@/types/global";

const EventDetails = ({ event }: { event: GlobalEvent }) => {
  const {
    title,
    description,
    expiryDate,
    loc,
    coverImage,
    qrImage,
    eventUrl,
    startDate,
    maxUploads,
    _id,
    themeColor,
  } = event!;

  const router = useRouter();

  const isExpired = event ? new Date(expiryDate) < new Date() : false;

  const handleCopyLink = () => {
    if (!event) return;
    navigator.clipboard.writeText(eventUrl);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = async () => {
    if (!event) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} - Photo/Video Upload`,
          text: `Upload your photos/videos to ${title}`,
          url: eventUrl,
        });
      } catch (error) {
        return handleError(error as ErrorResponse);
      }
    } else {
      try {
        await navigator.clipboard.writeText(eventUrl);
        toast.success("Link copied to clipboard!");
      } catch (error) {
        toast.error("Failed to copy link to clipboard!");
        return handleError(error as ErrorResponse);
      }
    }
  };

  const handleDownloadQR = (format: "png" | "pdf") => {
    if (!qrImage || !event) return;

    if (format === "png") {
      // Raw QR Code download
      fetch(qrImage)
        .then((res) => res.blob())
        .then((blob) => {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${event.title}-QR-Code.png`;
          link.click();
          URL.revokeObjectURL(url);
        });
    } else if (format === "pdf") {
      // Elegant Flyer PDF
      const doc = new jsPDF("p", "mm", "a4");
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;

      //  const themeColor = "#1E90FF";

      const hexToRgb = (hex: string) => {
        const bigint = parseInt(hex.slice(1), 16);
        return {
          r: (bigint >> 16) & 255,
          g: (bigint >> 8) & 255,
          b: bigint & 255,
        };
      };
      const { r, g, b } = hexToRgb(themeColor);

      // Divider line
      doc.setDrawColor(themeColor);
      doc.setLineWidth(1.5);
      doc.line(20, yOffset, pageWidth - 20, yOffset);
      yOffset += 15;

      // Event Title
      doc.setFont("inter", "bold");
      doc.setFontSize(22);
      doc.setTextColor(themeColor);
      doc.text(event.title, pageWidth / 2, yOffset, { align: "center" });
      yOffset += 15;

      // Event Description
      if (event.description) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor(50, 50, 50);
        const splitDesc = doc.splitTextToSize(
          event.description,
          pageWidth - 40
        );
        doc.text(splitDesc, pageWidth / 2, yOffset, { align: "center" });
        yOffset += splitDesc.length * 7 + 5;
      }

      // Event Date
      if (event.startDate) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(14);

        doc.setTextColor(themeColor);
        const dateStr = new Date(event.startDate).toLocaleDateString();
        doc.text(`Date: ${dateStr}`, pageWidth / 2, yOffset, {
          align: "center",
        });
        yOffset += 30;
      }

      // QR Section with background tint + rounded border
      const qrSize = 120;
      const qrX = (pageWidth - qrSize) / 2;
      const borderPadding = 12;
      const cornerRadius = 12;

      // Background block (subtle tint)
      doc.setFillColor(r, g, b);
      (doc as any).setGState(new (doc as any).GState({ opacity: 0.08 }));
      doc.roundedRect(
        qrX - borderPadding * 2,
        yOffset - borderPadding * 2,
        qrSize + borderPadding * 4,
        qrSize + borderPadding * 4,
        cornerRadius * 2,
        cornerRadius * 2,
        "F"
      );

      // Reset opacity for later drawings
      (doc as any).setGState(new (doc as any).GState({ opacity: 1 }));

      // Border around QR
      doc.setDrawColor(themeColor);
      doc.setLineWidth(2);
      doc.roundedRect(
        qrX - borderPadding,
        yOffset - borderPadding,
        qrSize + borderPadding * 2,
        qrSize + borderPadding * 2,
        cornerRadius,
        cornerRadius
      );

      // Insert QR code
      doc.addImage(qrImage, "PNG", qrX, yOffset, qrSize, qrSize);

      yOffset += qrSize + borderPadding * 3;

      // Upload instructions
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text(
        "Scan the QR code to share your photos and videos with us!",
        pageWidth / 2,
        yOffset,
        { align: "center" }
      );
      yOffset += 15;

      doc.setDrawColor(themeColor);
      doc.setLineWidth(0.8);
      doc.line(30, 280, pageWidth - 30, 280);

      // Footer branding
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Powered by MomentShare", pageWidth / 2, 290, {
        align: "center",
      });

      // Save PDF
      doc.save(`${event.title}-Flyer.pdf`);
    }
  };

  return (
    <div className="flex min-h-screen flex-1 flex-col px-6 pt-8 pb-14 sm:px-14 max-w-5xl mx-auto ">
      <div className="mx-auto px-4 py-8 w-full">
        <div className="max-w-5xl mx-auto">
          <div className="flex-between w-full mb-6">
            <Button
              onClick={() => router.back()}
              variant="link"
              size="sm"
              className="bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="max-sm:hidden">Back</span>
            </Button>
            <Button
              onClick={() => router.push(ROUTES.GALLERY(_id))}
              variant="link"
              size="sm"
              className="bg-primary-500 hover:primary-dark-gradient transition-all duration-300 ease-in-out  text-white font-semibold hover:shadow-primary-500/50 hover:shadow-sm cursor-pointer"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              <span className="max-sm:hidden">View Gallery</span>
            </Button>
          </div>
          {coverImage && (
            <div className="relative w-full max-lg:h-[20vh] max-sm:h-[20vh] h-[300px] rounded-lg mb-8 overflow-hidden">
              <Image
                src={coverImage}
                alt="Event Cover"
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center mb-8 w-full">
            <div className="flex flex-col items-center w-full">
              <h1 className="h2-bold text-center lg:h1-bold primary-text-gradient">
                {title}
              </h1>
              {description && (
                <p className="text-dark400_light900 text-wrap text-center mt-4">
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* QR Code Card */}
          <Card className="card-wrapper light-border mb-6">
            <CardHeader className="text-center text-light-400">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Camera className="h-5 w-5" />
                <span>Scan to Upload Photos/Videos</span>
              </CardTitle>
              <CardDescription className="text-xs lg:text-sm mt-2 text-center">
                {isExpired
                  ? "This event has expired and is no longer accepting uploads"
                  : "Attendees can scan this QR code to upload their photos/videos instantly"}
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
                <p className="paragraph-regular text-dark400_light900">
                  Direct Link:
                </p>
                <div className="flex items-center space-x-2 bg-secondary/50 rounded-lg p-3">
                  <code className="flex-1 paragraph-regular text-dark400_light900 text-left break-all">
                    {eventUrl}
                  </code>
                  <Button
                    onClick={() => handleCopyLink()}
                    size="sm"
                    variant="default"
                    className="primary-gradient text-white cursor-pointer"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleShare}
                  className="flex-1 border-2 border-primary-500 primary-text-gradient hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer"
                  disabled={isExpired}
                >
                  <Share2 className="h-4 w-4 mr-2 text-primary-500" />
                  Share with Attendees
                </Button>

                <Collapsible>
                  <CollapsibleTrigger className="w-full text-white  rounded-lg flex-center p-[5px] primary-gradient hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer">
                    <Download className="h-4 w-4 mr-2 " />
                    Download QR Code
                  </CollapsibleTrigger>
                  <CollapsibleContent className="w-full flex flex-col gap-2 mt-2">
                    <Button
                      onClick={() => handleDownloadQR("png")}
                      variant="default"
                      className="border-2 border-primary-500 primary-text-gradient hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer"
                      disabled={isExpired}
                    >
                      <Download className="h-4 w-4 mr-2 text-primary-500 " />
                      Download PNG
                    </Button>
                    <Button
                      onClick={() => handleDownloadQR("pdf")}
                      variant="default"
                      className="border-2 border-primary-500 primary-text-gradient hover:shadow-[0_0_4px_1px_rgba(245,158,11,0.6)] dark:hover:shadow-[0_0_15px_2px_rgba(245,158,11,0.7)] transition duration-300 ease-in-out cursor-pointer"
                      disabled={isExpired}
                    >
                      <Download className="h-4 w-4 mr-2 text-primary-500 " />
                      Download PDF
                    </Button>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Instructions */}
              <div className="text-left dark-gradient text-light-800 rounded-lg p-4 space-y-2">
                <h3 className="font-medium">Instructions for Attendees:</h3>
                <ol className="text-sm space-y-1 list-decimal list-inside">
                  <li>Open your phone&apos;s camera app</li>
                  <li>Point the camera at this QR code</li>
                  <li>Tap the notification that appears</li>
                  <li>Select photos/videos to upload</li>
                  <li>Your memories will be collected for the organizer!</li>
                </ol>
              </div>

              {/* Event Details */}
              <div className="flex flex-col lg:flex-row justify-between gap-4  rounded-lg p-4 light-border space-y-2 primary-gradient">
                <div className="text-left">
                  <h3 className="font-medium mb-2 h3-bold">Event Details:</h3>
                  <div className="space-y-1 paragrapher-regular text-light-900">
                    <p>
                      <strong>Start Date:</strong>{" "}
                      {format(new Date(startDate), "MMM d, yyyy")}
                    </p>

                    <p>
                      <strong>Location:</strong> {loc}
                    </p>

                    <p>
                      <strong>Expires:</strong>{" "}
                      {new Date(expiryDate).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {isExpired ? "Expired" : "Active"}
                    </p>
                  </div>
                </div>
                <div className="rounded-lg background-light900_dark200 p-4 shadow-light-100 ">
                  <h3 className="h3-semibold mb-2 text-center text-light400_light500">
                    Upload Limit
                  </h3>
                  <p className="text-dark400_light900 text-center my-2 h1-bold font-bold">
                    {maxUploads && maxUploads !== -1 ? maxUploads : "Unlimited"}
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

export default EventDetails;
